const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/cart - Obtener carrito del usuario
router.get('/', authenticate, cartController.getCart);

// POST /api/cart - Agregar producto al carrito
router.post('/', authenticate, cartController.addToCart);

// DELETE /api/cart - Vaciar carrito completo (debe ir ANTES de /:id)
router.delete('/', authenticate, cartController.clearCart);

// PUT /api/cart/:id - Actualizar cantidad de item
router.put('/:id', authenticate, cartController.updateCartItem);

// DELETE /api/cart/:id - Eliminar item del carrito
router.delete('/:id', authenticate, cartController.removeFromCart);

module.exports = router;
