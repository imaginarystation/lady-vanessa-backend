const OrderService = require('../services/orderService');

class OrderController {
    // Get all orders
    async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    }

    // Get order by ID
    async getOrderById(req, res) {
        try {
            const orderId = req.params.id;
            const order = await OrderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching order', error });
        }
    }

    // Create a new order
    async createOrder(req, res) {
        try {
            const orderData = req.body;
            const newOrder = await OrderService.createOrder(orderData);
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ message: 'Error creating order', error });
        }
    }

    // Update an order
    async updateOrder(req, res) {
        try {
            const orderId = req.params.id;
            const orderData = req.body;
            const updatedOrder = await OrderService.updateOrder(orderId, orderData);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error });
        }
    }

    // Delete an order
    async deleteOrder(req, res) {
        try {
            const orderId = req.params.id;
            const deletedOrder = await OrderService.deleteOrder(orderId);
            if (!deletedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting order', error });
        }
    }
}

module.exports = new OrderController();