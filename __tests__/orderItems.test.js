require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const Product = require('../src/models/productModel');
const OrderItem = require('../src/models/orderItem');
const sequelize = require('../src/config/dbConfig');

// Ensure associations are set up
require('../src/models/index');

describe('OrderItem Endpoints', () => {
    let testUser;
    let testProduct;
    let testOrder;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await OrderItem.destroy({ where: {}, truncate: true });
        await Order.destroy({ where: {}, truncate: true });
        await Product.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });

        // Create test user
        testUser = await User.create({
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'hashedpassword'
        });

        // Create test product
        testProduct = await Product.create({
            name: 'Test Product',
            description: 'Test Description',
            category: 'Test Category',
            price: 99.99,
            stock: 100
        });

        // Create test order
        testOrder = await Order.create({
            userId: testUser.id,
            totalPrice: 0,
            status: 'Pending'
        });
    });

    describe('POST /api/orders/:orderId/items', () => {
        it('should add items to an order', async () => {
            const itemData = {
                items: [
                    {
                        productId: testProduct.id,
                        quantity: 2,
                        price: 99.99
                    }
                ]
            };

            const response = await request(app)
                .post(`/api/orders/${testOrder.id}/items`)
                .send(itemData)
                .expect(201);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should add single item to an order', async () => {
            const itemData = {
                productId: testProduct.id,
                quantity: 1,
                price: 99.99
            };

            const response = await request(app)
                .post(`/api/orders/${testOrder.id}/items`)
                .send(itemData)
                .expect(201);

            expect(response.body).toBeDefined();
        });

        it('should return error for invalid order ID', async () => {
            const itemData = {
                productId: testProduct.id,
                quantity: 1,
                price: 99.99
            };

            const response = await request(app)
                .post('/api/orders/99999/items')
                .send(itemData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/orders/:orderId/items', () => {
        it('should get all items for an order', async () => {
            // Add items to order first
            await OrderItem.create({
                orderId: testOrder.id,
                productId: testProduct.id,
                quantity: 2,
                price: 99.99
            });

            const response = await request(app)
                .get(`/api/orders/${testOrder.id}/items`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('orderId', testOrder.id);
            expect(response.body[0]).toHaveProperty('productId', testProduct.id);
        });

        it('should return empty array for order with no items', async () => {
            const response = await request(app)
                .get(`/api/orders/${testOrder.id}/items`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should return empty array for non-existent order', async () => {
            const response = await request(app)
                .get('/api/orders/99999/items')
                .expect(200);

            // Service returns empty array for non-existent order, which is valid behavior
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe('PUT /api/orders/items/:id', () => {
        it('should update an order item', async () => {
            const orderItem = await OrderItem.create({
                orderId: testOrder.id,
                productId: testProduct.id,
                quantity: 1,
                price: 99.99
            });

            const updateData = {
                quantity: 3,
                price: 89.99
            };

            const response = await request(app)
                .put(`/api/orders/items/${orderItem.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('quantity', 3);
        });

        it('should return error for non-existent order item', async () => {
            const updateData = {
                quantity: 3
            };

            const response = await request(app)
                .put('/api/orders/items/99999')
                .send(updateData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('DELETE /api/orders/items/:id', () => {
        it('should remove an order item', async () => {
            const orderItem = await OrderItem.create({
                orderId: testOrder.id,
                productId: testProduct.id,
                quantity: 1,
                price: 99.99
            });

            const response = await request(app)
                .delete(`/api/orders/items/${orderItem.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');

            // Verify item is deleted
            const deletedItem = await OrderItem.findByPk(orderItem.id);
            expect(deletedItem).toBeNull();
        });

        it('should return error for non-existent order item', async () => {
            const response = await request(app)
                .delete('/api/orders/items/99999')
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });
});
