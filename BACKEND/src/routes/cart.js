const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/cart
router.get('/', authenticate, cartController.getCart);

// POST /api/cart
router.post('/', authenticate, cartController.addToCart);

// DELETE /api/cart/:id
router.delete('/:id', authenticate, cartController.removeFromCart);

module.exports = router;
