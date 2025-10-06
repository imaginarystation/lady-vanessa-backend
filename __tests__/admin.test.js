require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Admin = require('../src/models/Admin');
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
});
