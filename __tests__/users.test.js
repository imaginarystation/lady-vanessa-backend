require('./setup');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const sequelize = require('../src/config/dbConfig');

describe('User Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    describe('POST /api/users/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', userData.email);
            expect(response.body.user).toHaveProperty('name', userData.name);
            expect(response.body.user).not.toHaveProperty('password', userData.password);
        });

        it('should return error when registering with duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            // First registration
            await request(app)
                .post('/api/users/register')
                .send(userData);

            // Second registration with same email
            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });

        it('should return error when required fields are missing', async () => {
            const userData = {
                name: 'Test User'
                // Missing email and password
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(500);

            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Register a user before testing login
            await request(app)
                .post('/api/users/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Login successful');
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
        });

        it('should return error with incorrect password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid password');
        });

        it('should return error with non-existent user', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(404);

            expect(response.body).toHaveProperty('error', 'User not found');
        });
    });
});
