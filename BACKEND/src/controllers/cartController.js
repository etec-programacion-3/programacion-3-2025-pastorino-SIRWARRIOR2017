const { CartItem, Product } = require('../models');

module.exports = {
  // GET /api/cart - Obtener items del carrito del usuario
  getCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const items = await CartItem.findAll({ where: { userId }, include: [Product] });
      res.json(items);
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

  // DELETE /api/cart/:id - Eliminar item del carrito por id
  removeFromCart: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const item = await CartItem.findOne({ where: { id, userId } });
      if (!item) return res.status(404).json({ error: 'Cart item not found' });
      await item.destroy();
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot remove item', details: err.message });
    }
  }
};
