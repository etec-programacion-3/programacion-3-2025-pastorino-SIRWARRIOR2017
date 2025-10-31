const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const orderValidator = require('../validators/orderValidator');
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/orders - Obtener órdenes (usuario: solo sus órdenes, admin: todas)
router.get('/', authenticate, orderController.getAllOrders);

// GET /api/orders/:id - Obtener orden por ID
router.get('/:id', authenticate, orderController.getOrderById);

// POST /api/orders - Crear orden (checkout del carrito)
router.post('/', authenticate, orderValidator.createOrder, orderController.createOrder);

// PUT /api/orders/:id - Actualizar orden (admin: estado, usuario: dirección)
router.put('/:id', authenticate, orderValidator.updateOrder, orderController.updateOrder);

// POST /api/orders/:id/cancel - Cancelar orden
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;
