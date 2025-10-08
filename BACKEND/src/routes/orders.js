const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const orderValidator = require('../validators/orderValidator');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderValidator.createOrder, orderController.createOrder);
router.put('/:id', orderValidator.updateOrder, orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
