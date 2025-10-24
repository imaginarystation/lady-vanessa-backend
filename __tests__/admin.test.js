require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Admin = require('../src/models/Admin');
const Product = require('../src/models/productModel');
const Order = require('../src/models/Order');
const OrderItem = require('../src/models/orderItem');
const User = require('../src/models/User');
const sequelize = require('../src/config/dbConfig');

describe('Admin Endpoints', () => {
    let adminToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await Admin.destroy({ where: {}, truncate: true });
    });

    describe('POST /api/admin/register', () => {
        it('should register a new admin successfully', async () => {
            const adminData = {
                name: 'Test Admin',
                email: 'admin@example.com',
                password: 'adminpass123'
            };

            const response = await request(app)
                .post('/api/admin/register')
                .send(adminData)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'Admin registered successfully');
            expect(response.body).toHaveProperty('admin');
            expect(response.body.admin).toHaveProperty('email', adminData.email);
            expect(response.body.admin).toHaveProperty('name', adminData.name);
        });

        it('should return error when registering with duplicate email', async () => {
            const adminData = {
                name: 'Test Admin',
                email: 'admin@example.com',
                password: 'adminpass123'
            };

            // First registration
            await request(app)
                .post('/api/admin/register')
                .send(adminData);

            // Second registration with same email
            const response = await request(app)
                .post('/api/admin/register')
                .send(adminData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });

        it('should return error when required fields are missing', async () => {
            const adminData = {
                name: 'Test Admin'
                // Missing email and password
            };

            const response = await request(app)
                .post('/api/admin/register')
                .send(adminData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/admin/login', () => {
        beforeEach(async () => {
            // Register an admin before testing login
            await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'admin@example.com',
                password: 'adminpass123'
            };

            const response = await request(app)
                .post('/api/admin/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('admin');
            expect(response.body.admin).toHaveProperty('email', loginData.email);
            expect(typeof response.body.token).toBe('string');

            // Store token for protected route tests
            adminToken = response.body.token;
        });

        it('should return error with incorrect password', async () => {
            const loginData = {
                email: 'admin@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/admin/login')
                .send(loginData)
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid password');
        });

        it('should return error with non-existent admin', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'adminpass123'
            };

            const response = await request(app)
                .post('/api/admin/login')
                .send(loginData)
                .expect(404);

            expect(response.body).toHaveProperty('error', 'Admin not found');
        });
    });

    describe('GET /api/admin (Protected)', () => {
        beforeEach(async () => {
            // Register and login to get token
            await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        it('should return all admins with valid token', async () => {
            const response = await request(app)
                .get('/api/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should return 401 without token', async () => {
            const response = await request(app)
                .get('/api/admin')
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });

        it('should return 401 with invalid token', async () => {
            const response = await request(app)
                .get('/api/admin')
                .set('Authorization', 'Bearer invalidtoken')
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/admin/:id (Protected)', () => {
        let testAdmin;

        beforeEach(async () => {
            // Register and login to get token
            const registerResponse = await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            testAdmin = registerResponse.body.admin;

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        it('should return admin by ID with valid token', async () => {
            const response = await request(app)
                .get(`/api/admin/${testAdmin.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', testAdmin.id);
            expect(response.body).toHaveProperty('email', testAdmin.email);
        });

        it('should return 401 without token', async () => {
            const response = await request(app)
                .get(`/api/admin/${testAdmin.id}`)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/admin/:id (Protected)', () => {
        let testAdmin;

        beforeEach(async () => {
            // Register and login to get token
            const registerResponse = await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            testAdmin = registerResponse.body.admin;

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        it('should update admin with valid token', async () => {
            const updateData = {
                name: 'Updated Admin Name'
            };

            const response = await request(app)
                .put(`/api/admin/${testAdmin.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('name', updateData.name);
        });

        it('should return 401 without token', async () => {
            const updateData = {
                name: 'Updated Admin Name'
            };

            const response = await request(app)
                .put(`/api/admin/${testAdmin.id}`)
                .send(updateData)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('DELETE /api/admin/:id (Protected)', () => {
        let testAdmin;

        beforeEach(async () => {
            // Register and login to get token
            const registerResponse = await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            testAdmin = registerResponse.body.admin;

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        it('should delete admin with valid token', async () => {
            const response = await request(app)
                .delete(`/api/admin/${testAdmin.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');

            // Verify admin is deleted
            const deletedAdmin = await Admin.findByPk(testAdmin.id);
            expect(deletedAdmin).toBeNull();
        });

        it('should return 401 without token', async () => {
            const response = await request(app)
                .delete(`/api/admin/${testAdmin.id}`)
                .expect(401);

            expect(response.body).toHaveProperty('error');
        });
    });

    // Admin Product Management Tests
    describe('Admin Product Management', () => {
        let adminToken;

        beforeEach(async () => {
            await Product.destroy({ where: {}, truncate: true });
            
            // Register and login to get token
            await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        describe('GET /api/admin/products', () => {
            it('should return paginated products', async () => {
                // Create test products
                await Product.create({ name: 'Product 1', price: 99.99, stock: 10 });
                await Product.create({ name: 'Product 2', price: 149.99, stock: 5 });

                const response = await request(app)
                    .get('/api/admin/products')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('data');
                expect(response.body).toHaveProperty('total');
                expect(response.body).toHaveProperty('page');
                expect(response.body).toHaveProperty('limit');
                expect(Array.isArray(response.body.data)).toBe(true);
                expect(response.body.data.length).toBe(2);
                expect(response.body.total).toBe(2);
            });

            it('should support pagination parameters', async () => {
                // Create 5 test products
                for (let i = 1; i <= 5; i++) {
                    await Product.create({ name: `Product ${i}`, price: 99.99, stock: 10 });
                }

                const response = await request(app)
                    .get('/api/admin/products?page=1&limit=2')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body.data.length).toBe(2);
                expect(response.body.total).toBe(5);
                expect(response.body.page).toBe(1);
                expect(response.body.limit).toBe(2);
            });
        });

        describe('POST /api/admin/products', () => {
            it('should create a new product', async () => {
                const productData = {
                    name: 'New Product',
                    description: 'New Description',
                    price: 199.99,
                    stock: 20
                };

                const response = await request(app)
                    .post('/api/admin/products')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(productData)
                    .expect(201);

                expect(response.body).toHaveProperty('name', productData.name);
                expect(response.body).toHaveProperty('price', productData.price);
            });
        });

        describe('PUT /api/admin/products/:id', () => {
            it('should update a product', async () => {
                const product = await Product.create({
                    name: 'Original Product',
                    price: 99.99,
                    stock: 10
                });

                const updateData = { name: 'Updated Product', price: 149.99 };

                const response = await request(app)
                    .put(`/api/admin/products/${product.id}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body).toHaveProperty('name', updateData.name);
                expect(response.body).toHaveProperty('price', updateData.price);
            });
        });

        describe('DELETE /api/admin/products/:id', () => {
            it('should delete a product', async () => {
                const product = await Product.create({
                    name: 'Product to Delete',
                    price: 99.99,
                    stock: 10
                });

                const response = await request(app)
                    .delete(`/api/admin/products/${product.id}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('message', 'Product deleted successfully');
            });
        });
    });

    // Admin Order Management Tests
    describe('Admin Order Management', () => {
        let adminToken;
        let testUser;

        beforeEach(async () => {
            await OrderItem.destroy({ where: {}, truncate: true });
            await Order.destroy({ where: {}, truncate: true });
            await User.destroy({ where: {}, truncate: true });
            
            // Create test user
            testUser = await User.create({
                name: 'Test User',
                email: 'user@example.com',
                password: 'password'
            });

            // Register and login to get admin token
            await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        describe('GET /api/admin/orders', () => {
            it('should return paginated orders', async () => {
                // Create test orders
                await Order.create({ userId: testUser.id, totalPrice: 99.99, status: 'Pending' });
                await Order.create({ userId: testUser.id, totalPrice: 199.99, status: 'Completed' });

                const response = await request(app)
                    .get('/api/admin/orders')
                    .set('Authorization', `Bearer ${adminToken}`);

                if (response.status !== 200) {
                    console.log('Error response:', response.body);
                }
                
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('data');
                expect(response.body).toHaveProperty('total');
                expect(response.body).toHaveProperty('page');
                expect(response.body).toHaveProperty('limit');
                expect(Array.isArray(response.body.data)).toBe(true);
                expect(response.body.data.length).toBe(2);
                expect(response.body.total).toBe(2);
            });
        });

        describe('PUT /api/admin/orders/:id', () => {
            it('should update an order', async () => {
                const order = await Order.create({
                    userId: testUser.id,
                    totalPrice: 99.99,
                    status: 'Pending'
                });

                const updateData = { status: 'Completed' };

                const response = await request(app)
                    .put(`/api/admin/orders/${order.id}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .send(updateData)
                    .expect(200);

                expect(response.body).toHaveProperty('status', 'Completed');
            });
        });
    });

    // Admin User Management Tests
    describe('Admin User Management', () => {
        let adminToken;

        beforeEach(async () => {
            // Clean up in proper order due to foreign key constraints
            await OrderItem.destroy({ where: {}, truncate: true });
            await Order.destroy({ where: {}, truncate: true });
            await User.destroy({ where: {}, truncate: true });
            
            // Register and login to get admin token
            await request(app)
                .post('/api/admin/register')
                .send({
                    name: 'Test Admin',
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            const loginResponse = await request(app)
                .post('/api/admin/login')
                .send({
                    email: 'admin@example.com',
                    password: 'adminpass123'
                });

            adminToken = loginResponse.body.token;
        });

        describe('GET /api/admin/users', () => {
            it('should return paginated users', async () => {
                // Create test users
                await User.create({ name: 'User 1', email: 'user1@example.com', password: 'password' });
                await User.create({ name: 'User 2', email: 'user2@example.com', password: 'password' });

                const response = await request(app)
                    .get('/api/admin/users')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('data');
                expect(response.body).toHaveProperty('total');
                expect(response.body).toHaveProperty('page');
                expect(response.body).toHaveProperty('limit');
                expect(Array.isArray(response.body.data)).toBe(true);
                expect(response.body.data.length).toBe(2);
                expect(response.body.total).toBe(2);
            });

            it('should not include passwords in user data', async () => {
                await User.create({ name: 'User 1', email: 'user1@example.com', password: 'password' });

                const response = await request(app)
                    .get('/api/admin/users')
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body.data[0]).not.toHaveProperty('password');
            });
        });

        describe('GET /api/admin/users/:id', () => {
            it('should return a specific user', async () => {
                const user = await User.create({
                    name: 'Test User',
                    email: 'user@example.com',
                    password: 'password'
                });

                const response = await request(app)
                    .get(`/api/admin/users/${user.id}`)
                    .set('Authorization', `Bearer ${adminToken}`)
                    .expect(200);

                expect(response.body).toHaveProperty('id', user.id);
                expect(response.body).toHaveProperty('email', user.email);
                expect(response.body).not.toHaveProperty('password');
            });
        });
    });
});
