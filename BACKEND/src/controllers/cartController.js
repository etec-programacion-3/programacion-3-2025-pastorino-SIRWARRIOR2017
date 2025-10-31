const { CartItem, Product } = require('../models');

module.exports = {
  // GET /api/cart - Obtener items del carrito del usuario
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const items = await CartItem.findAll({
        where: { userId },
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'stock', 'images', 'brand', 'isActive']
        }]
      });

      // Calcular totales
      let subtotal = 0;
      const validItems = [];

      for (const item of items) {
        if (item.Product && item.Product.isActive) {
          const itemTotal = parseFloat(item.Product.price) * item.quantity;
          subtotal += itemTotal;
          validItems.push(item);
        }
      }

      const tax = subtotal * 0.16; // 16% IVA
      const shipping = subtotal > 1000 ? 0 : 50;
      const total = subtotal + tax + shipping;

      res.json({
        items: validItems,
        summary: {
          subtotal,
          tax,
          shipping,
          total,
          itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch cart', details: err.message });
    }
  },

  // POST /api/cart - Añadir o actualizar item en carrito
  addToCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;
      if (!productId || quantity < 1) return res.status(400).json({ error: 'productId and positive quantity required' });

      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });

      if (product.stock < quantity) return res.status(400).json({ error: 'Not enough stock available' });

      // If item already in cart, increase quantity but don't exceed stock
      const existing = await CartItem.findOne({ where: { userId, productId } });
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) return res.status(400).json({ error: 'Not enough stock to increase quantity' });
        existing.quantity = newQty;
        await existing.save();
        return res.json(existing);
      }

      const item = await CartItem.create({ userId, productId, quantity });
      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot add to cart', details: err.message });
    }
  },

  // PUT /api/cart/:id - Actualizar cantidad de item en carrito
  updateCartItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Valid quantity required' });
      }

      const item = await CartItem.findOne({
        where: { id, userId },
        include: [Product]
      });

      if (!item) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      if (quantity > item.Product.stock) {
        return res.status(400).json({
          error: 'Not enough stock available',
          available: item.Product.stock
        });
      }

      item.quantity = quantity;
      await item.save();

      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update cart item', details: err.message });
    }
  },

  // DELETE /api/cart/:id - Eliminar item del carrito por id
  removeFromCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const item = await CartItem.findOne({ where: { id, userId } });
      if (!item) return res.status(404).json({ error: 'Cart item not found' });
      await item.destroy();
      res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot remove item', details: err.message });
    }
  },

  // DELETE /api/cart - Vaciar carrito completo
  clearCart: async (req, res) => {
    try {
      const userId = req.user.id;
      await CartItem.destroy({ where: { userId } });
      res.json({ success: true, message: 'Cart cleared successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot clear cart', details: err.message });
    }
  }
};
