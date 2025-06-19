const orderItemService = require('../services/orderItemService');

class OrderItemController {
    // Create a new OrderItem
    async createOrderItem(req, res) {
        try {
            const orderItem = await orderItemService.createOrderItem(req.body);
            res.status(201).json(orderItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all OrderItems for a specific order
    async getOrderItemsByOrderId(req, res) {
        try {
            const { orderId } = req.params;
            const orderItems = await orderItemService.getOrderItemsByOrderId(orderId);
            res.status(200).json(orderItems);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update an OrderItem
    async updateOrderItem(req, res) {
        try {
            const { id } = req.params;
            const updatedOrderItem = await orderItemService.updateOrderItem(id, req.body);
            res.status(200).json(updatedOrderItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Delete an OrderItem
    async deleteOrderItem(req, res) {
        try {
            const { id } = req.params;
            const result = await orderItemService.deleteOrderItem(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderItemController();