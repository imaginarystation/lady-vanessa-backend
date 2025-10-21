require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { Category } = require('../src/models');
const sequelize = require('../src/config/dbConfig');

describe('Category Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/categories', () => {
        it('should return all categories', async () => {
            await Category.create({
                name: 'Test Category',
                description: 'Test description',
                status: 'Active',
            });

            const res = await request(app).get('/api/categories');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return empty array when no categories exist', async () => {
            await Category.destroy({ where: {} });
            const res = await request(app).get('/api/categories');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/categories/:id', () => {
        it('should return a category by ID', async () => {
            const category = await Category.create({
                name: 'Test Category 2',
                description: 'Test description 2',
                status: 'Active',
            });

            const res = await request(app).get(`/api/categories/${category.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Test Category 2');
        });

        it('should return 404 for non-existent category', async () => {
            const res = await request(app).get('/api/categories/99999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /api/categories', () => {
        it('should create a new category', async () => {
            const res = await request(app)
                .post('/api/categories')
                .send({
                    name: 'New Category',
                    description: 'New description',
                    status: 'Active',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toBe('New Category');
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should update an existing category', async () => {
            const category = await Category.create({
                name: 'Update Test',
                description: 'Original description',
                status: 'Active',
            });

            const res = await request(app)
                .put(`/api/categories/${category.id}`)
                .send({
                    name: 'Updated Category',
                    description: 'Updated description',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Updated Category');
        });

        it('should return error for non-existent category', async () => {
            const res = await request(app)
                .put('/api/categories/99999')
                .send({
                    name: 'Updated',
                });
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('should delete a category', async () => {
            const category = await Category.create({
                name: 'Delete Test',
                description: 'To be deleted',
                status: 'Active',
            });

            const res = await request(app).delete(`/api/categories/${category.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Category deleted successfully');
        });

        it('should return error for non-existent category', async () => {
            const res = await request(app).delete('/api/categories/99999');
            expect(res.statusCode).toEqual(404);
        });
    });
});
