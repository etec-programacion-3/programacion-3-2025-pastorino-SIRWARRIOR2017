const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const orderItemValidator = require('../validators/orderItemValidator');

router.get('/', orderItemController.getAllOrderItems);
router.get('/:id', orderItemController.getOrderItemById);
router.post('/', orderItemValidator.createOrderItem, orderItemController.createOrderItem);
router.put('/:id', orderItemValidator.updateOrderItem, orderItemController.updateOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

module.exports = router;
