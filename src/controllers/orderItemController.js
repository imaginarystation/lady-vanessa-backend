const orderItemService = require('../services/orderItemService');

class OrderItemController {
    // Add items to an existing order
    async addItemsToOrder(req, res) {
        try {
            const { orderId } = req.params;
            const items = req.body.items || req.body;
            const orderItems = await orderItemService.addItemsToOrder(orderId, items);
            res.status(201).json(orderItems);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Get all OrderItems for a specific order
    async getItemsByOrderId(req, res) {
        try {
            const { orderId } = req.params;
            const orderItems = await orderItemService.getItemsByOrderId(orderId);
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

    // Remove an item from an order
    async removeOrderItem(req, res) {
        try {
            const { id } = req.params;
            const result = await orderItemService.removeOrderItem(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderItemController();