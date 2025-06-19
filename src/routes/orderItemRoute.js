const express = require('express');
const orderItemController = require('../controllers/orderItemController');

const router = express.Router();

router.post('/:orderId/items', orderItemController.addItemsToOrder);
router.get('/:orderId/items', orderItemController.getItemsByOrderId);
router.put('/items/:id', orderItemController.updateOrderItem);
router.delete('/items/:id', orderItemController.removeOrderItem);

module.exports = router;