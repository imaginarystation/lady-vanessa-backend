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

describe('Order Endpoints', () => {
    let testUser;
    let testProduct;

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
    });

    describe('GET /api/orders', () => {
        it('should return all orders', async () => {
            // Create test orders
            await Order.create({
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending'
            });
            await Order.create({
                userId: testUser.id,
                totalPrice: 199.99,
                status: 'Completed'
            });

            const response = await request(app)
                .get('/api/orders')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should return empty array when no orders exist', async () => {
            const response = await request(app)
                .get('/api/orders')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe('GET /api/orders/:id', () => {
        it('should return an order by ID', async () => {
            const order = await Order.create({
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending'
            });

            const response = await request(app)
                .get(`/api/orders/${order.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', order.id);
            expect(response.body).toHaveProperty('totalPrice');
            expect(response.body).toHaveProperty('status', 'Pending');
        });

        it('should return error for non-existent order', async () => {
            const response = await request(app)
                .get('/api/orders/99999')
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/orders', () => {
        it('should create a new order', async () => {
            const orderData = {
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending'
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('userId', testUser.id);
            expect(response.body).toHaveProperty('status', 'Pending');
        });

        it('should create order with items', async () => {
            const orderData = {
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending',
                orderItems: [
                    {
                        productId: testProduct.id,
                        quantity: 1,
                        price: 99.99
                    }
                ]
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('userId', testUser.id);
        });

        it('should return error when required fields are missing', async () => {
            const orderData = {
                status: 'Pending'
                // Missing userId and totalPrice
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PUT /api/orders/:id', () => {
        it('should update an existing order', async () => {
            const order = await Order.create({
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending'
            });

            const updateData = {
                status: 'Completed',
                totalPrice: 149.99
            };

            const response = await request(app)
                .put(`/api/orders/${order.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'Completed');
        });

        it('should return error for non-existent order', async () => {
            const updateData = {
                status: 'Completed'
            };

            const response = await request(app)
                .put('/api/orders/99999')
                .send(updateData)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/orders/:id', () => {
        it('should delete an order', async () => {
            const order = await Order.create({
                userId: testUser.id,
                totalPrice: 99.99,
                status: 'Pending'
            });

            const response = await request(app)
                .delete(`/api/orders/${order.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Order deleted successfully');

            // Verify order is deleted
            const deletedOrder = await Order.findByPk(order.id);
            expect(deletedOrder).toBeNull();
        });

        it('should return error for non-existent order', async () => {
            const response = await request(app)
                .delete('/api/orders/99999')
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });
});
