const { Order, OrderItem, CartItem, Product, sequelize } = require('../models');

module.exports = {
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.findAll({ include: [OrderItem] });
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch orders', details: err.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      const order = await Order.findByPk(id, { include: [OrderItem] });
      if (!order) return res.status(404).json({ error: 'Order not found' });
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
    res.status(501).json({ error: 'Not implemented' });
  },

  deleteOrder: async (req, res) => {
    res.status(501).json({ error: 'Not implemented' });
  }
};
