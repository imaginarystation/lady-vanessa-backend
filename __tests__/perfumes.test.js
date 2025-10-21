require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { Perfume } = require('../src/models');
const sequelize = require('../src/config/dbConfig');

describe('Perfume Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/perfumes', () => {
        it('should return all perfumes', async () => {
            await Perfume.create({
                name: 'Test Perfume',
                price: 150.00,
                image: 'test.jpg',
                sectionTag: 'For Her',
            });

            const res = await request(app).get('/api/perfumes');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should filter perfumes by sectionTag', async () => {
            await Perfume.destroy({ where: {} });
            await Perfume.create({
                name: 'Perfume for Him',
                price: 150.00,
                sectionTag: 'For Him',
            });
            await Perfume.create({
                name: 'Perfume for Her',
                price: 180.00,
                sectionTag: 'For Her',
            });

            const res = await request(app).get('/api/perfumes?sectionTag=For Him');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].sectionTag).toBe('For Him');
        });
    });

    describe('GET /api/perfumes/search', () => {
        it('should search perfumes by name', async () => {
            await Perfume.destroy({ where: {} });
            await Perfume.create({
                name: 'Lavender Dream',
                price: 150.00,
            });

            const res = await request(app).get('/api/perfumes/search?q=Lavender');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/perfumes/:id', () => {
        it('should return a perfume by ID', async () => {
            const perfume = await Perfume.create({
                name: 'Test Perfume 2',
                price: 200.00,
            });

            const res = await request(app).get(`/api/perfumes/${perfume.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Test Perfume 2');
        });

        it('should return 404 for non-existent perfume', async () => {
            const res = await request(app).get('/api/perfumes/99999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /api/perfumes', () => {
        it('should create a new perfume', async () => {
            const res = await request(app)
                .post('/api/perfumes')
                .send({
                    name: 'New Perfume',
                    price: 175.00,
                    sectionTag: 'Classics',
                    filterTags: ['Timeless Scents'],
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toBe('New Perfume');
        });
    });

    describe('PUT /api/perfumes/:id', () => {
        it('should update an existing perfume', async () => {
            const perfume = await Perfume.create({
                name: 'Update Test',
                price: 150.00,
            });

            const res = await request(app)
                .put(`/api/perfumes/${perfume.id}`)
                .send({
                    name: 'Updated Perfume',
                    price: 200.00,
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Updated Perfume');
            expect(parseFloat(res.body.price)).toBe(200.00);
        });

        it('should return error for non-existent perfume', async () => {
            const res = await request(app)
                .put('/api/perfumes/99999')
                .send({
                    name: 'Updated',
                });
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /api/perfumes/:id', () => {
        it('should delete a perfume', async () => {
            const perfume = await Perfume.create({
                name: 'Delete Test',
                price: 100.00,
            });

            const res = await request(app).delete(`/api/perfumes/${perfume.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Perfume deleted successfully');
        });

        it('should return error for non-existent perfume', async () => {
            const res = await request(app).delete('/api/perfumes/99999');
            expect(res.statusCode).toEqual(404);
        });
    });
});
