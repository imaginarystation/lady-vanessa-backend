const OrderItem = require('../models/orderItem');

class OrderItemService {
    // Add items to an existing order
    async addItemsToOrder(orderId, items) {
        try {
            const orderItems = items.map(item => ({
                ...item,
                orderId,
            }));
            await OrderItem.bulkCreate(orderItems);
            return orderItems;
        } catch (error) {
            throw new Error('Error adding items to order: ' + error.message);
        }
    }

    // Get items for a specific order
    async getItemsByOrderId(orderId) {
        try {
            const orderItems = await OrderItem.findAll({ where: { orderId } });
            return orderItems;
        } catch (error) {
            throw new Error('Error fetching order items: ' + error.message);
        }
    }

    // Update an item in an order
    async updateOrderItem(itemId, updatedData) {
        try {
            const orderItem = await OrderItem.findByPk(itemId);
            if (!orderItem) {
                throw new Error('Order item not found');
            }
            await orderItem.update(updatedData);
            return orderItem;
        } catch (error) {
            throw new Error('Error updating order item: ' + error.message);
        }
    }

    // Remove an item from an order
    async removeOrderItem(itemId) {
        try {
            const orderItem = await OrderItem.findByPk(itemId);
            if (!orderItem) {
                throw new Error('Order item not found');
            }
            await orderItem.destroy();
            return { message: 'Order item removed successfully' };
        } catch (error) {
            throw new Error('Error removing order item: ' + error.message);
        }
    }
}

module.exports = new OrderItemService();