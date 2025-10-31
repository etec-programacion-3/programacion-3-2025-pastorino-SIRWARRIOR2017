const { Order, OrderItem, CartItem, Product, User, sequelize } = require('../models');

module.exports = {
  getAllOrders: async (req, res) => {
    try {
      const isAdmin = req.user?.role === 'admin';
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const where = isAdmin ? {} : { userId };
      const { status, sortBy = 'createdAt', order = 'DESC' } = req.query;

      if (status) where.status = status;

      const orders = await Order.findAll({
        where,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: OrderItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price', 'images']
            }]
          }
        ],
        order: [[sortBy, order]]
      });

      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch orders', details: err.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'admin';

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email', 'phone', 'address']
          },
          {
            model: OrderItem,
            include: [{
              model: Product,
              attributes: ['id', 'name', 'price', 'brand', 'model', 'images']
            }]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Verificar que el usuario tenga permiso para ver esta orden
      if (!isAdmin && order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized to view this order' });
      }

      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch order', details: err.message });
    }
  },

  // Checkout: crear orden a partir del carrito del usuario
  createOrder: async (req, res) => {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const t = await sequelize.transaction();
    try {
      // Obtener items del carrito del usuario con sus productos
      const cartItems = await CartItem.findAll({ where: { userId }, include: [Product], transaction: t, lock: t.LOCK.UPDATE });
      if (!cartItems || cartItems.length === 0) {
        await t.rollback();
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Verificar stock disponible
      for (const ci of cartItems) {
        const product = ci.Product || (await Product.findByPk(ci.productId, { transaction: t, lock: t.LOCK.UPDATE }));
        if (!product) {
          await t.rollback();
          return res.status(400).json({ error: `Product not found: ${ci.productId}` });
        }
        if (product.stock < ci.quantity) {
          await t.rollback();
          return res.status(400).json({ error: `Insufficient stock for product ${product.id}` });
        }
      }

      // Calcular total
      let total = 0;
      for (const ci of cartItems) {
        const price = parseFloat(ci.Product.price);
        total += price * ci.quantity;
      }

      // Crear la orden
      const order = await Order.create({
        orderNumber: Order.generateOrderNumber(),
        userId,
        status: 'pending',
        total
      }, { transaction: t });

      // Crear order items y actualizar stock
      for (const ci of cartItems) {
        const product = ci.Product || (await Product.findByPk(ci.productId, { transaction: t, lock: t.LOCK.UPDATE }));
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: ci.quantity,
          unitPrice: product.price
        }, { transaction: t });

        // Reducir stock
        product.stock = product.stock - ci.quantity;
        await product.save({ transaction: t });
      }

      // Limpiar carrito
      await CartItem.destroy({ where: { userId }, transaction: t });

      await t.commit();
      res.status(201).json({ orderId: order.id, orderNumber: order.orderNumber });
    } catch (err) {
      console.error('Checkout error', err);
      try { await t.rollback(); } catch (e) { console.error('Rollback failed', e); }
      res.status(500).json({ error: 'Checkout failed', details: err.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, address } = req.body;
      const isAdmin = req.user?.role === 'admin';

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Solo admin puede actualizar el estado
      if (status && !isAdmin) {
        return res.status(403).json({ error: 'Only admin can update order status' });
      }

      // El usuario puede actualizar su dirección si la orden está pendiente
      if (address && order.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updates = {};
      if (status && isAdmin) updates.status = status;
      if (address && order.status === 'pending') updates.address = address;

      await order.update(updates);

      // Recargar con relaciones
      const updatedOrder = await Order.findByPk(id, {
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: OrderItem, include: [{ model: Product }] }
        ]
      });

      res.json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update order', details: err.message });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'admin';

      const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, include: [Product] }]
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Verificar permisos
      if (!isAdmin && order.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Solo se puede cancelar si está pendiente
      if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Can only cancel pending orders' });
      }

      const t = await sequelize.transaction();
      try {
        // Devolver stock a los productos
        for (const item of order.OrderItems) {
          const product = await Product.findByPk(item.productId, { transaction: t });
          if (product) {
            product.stock += item.quantity;
            await product.save({ transaction: t });
          }
        }

        // Actualizar estado de la orden
        order.status = 'cancelled';
        await order.save({ transaction: t });

        await t.commit();
        res.json({ message: 'Order cancelled successfully', order });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot cancel order', details: err.message });
    }
  }
};
