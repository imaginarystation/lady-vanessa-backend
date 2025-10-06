const Order = require('../models/Order');
const OrderItem = require('../models/orderItem');

class OrderService {
    // Get all orders
    async getAllOrders() {
        try {
            const orders = await Order.findAll({
                include: [OrderItem],
            });
            return orders;
        } catch (error) {
            throw new Error('Error fetching orders: ' + error.message);
        }
    }

    // Get order by ID
    async getOrderById(orderId) {
        try {
            const order = await Order.findByPk(orderId, {
                include: [OrderItem],
            });
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error fetching order: ' + error.message);
        }
    }

    // Create a new order
    async createOrder(orderData, orderItems) {
        try {
            const order = await Order.create(orderData);

            // Add items to the order
            if (orderItems && orderItems.length > 0) {
                const items = orderItems.map(item => ({
                    ...item,
                    orderId: order.id,
                }));
                await OrderItem.bulkCreate(items);
            }

            return order;
        } catch (error) {
            throw new Error('Error creating order: ' + error.message);
        }
    }

    // Update an order
    async updateOrder(orderId, orderData) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            await order.update(orderData);
            return order;
        } catch (error) {
            throw new Error('Error updating order: ' + error.message);
        }
    }

    // Get order details (including items)
    async getOrderDetails(orderId) {
        try {
            const order = await Order.findByPk(orderId, {
                include: [OrderItem],
            });
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            throw new Error('Error fetching order details: ' + error.message);
        }
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            await order.update({ status });
            return order;
        } catch (error) {
            throw new Error('Error updating order status: ' + error.message);
        }
    }
    
    // Delete an order
    async deleteOrder(orderId) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            
            // Delete associated order items
            await OrderItem.destroy({ where: { orderId } });
            
            // Delete the order
            await order.destroy();
            
            return { message: 'Order deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting order: ' + error.message);
        }
    }
}

module.exports = new OrderService();