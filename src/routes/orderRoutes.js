const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get an order by ID
router.get('/:id', orderController.getOrderById);

// Route to update an order by ID
router.put('/:id', orderController.updateOrder);

// Route to delete an order by ID
router.delete('/:id', orderController.deleteOrder);

// Route to list all orders
router.get('/', orderController.getAllOrders);

module.exports = router;
