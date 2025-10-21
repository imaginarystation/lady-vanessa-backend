require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { Banner } = require('../src/models');
const sequelize = require('../src/config/dbConfig');

describe('Banner Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/banners', () => {
        it('should return all banners', async () => {
            await Banner.create({
                mediaType: 'image',
                src: 'https://example.com/banner.jpg',
                title: 'Summer Sale',
                link: '/sale',
                status: 'Active',
            });

            const res = await request(app).get('/api/banners');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return empty array when no banners exist', async () => {
            await Banner.destroy({ where: {} });
            const res = await request(app).get('/api/banners');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/banners/:id', () => {
        it('should return a banner by ID', async () => {
            const banner = await Banner.create({
                mediaType: 'image',
                src: 'https://example.com/banner2.jpg',
                title: 'Test Banner',
                link: '/test',
                status: 'Active',
            });

            const res = await request(app).get(`/api/banners/${banner.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Test Banner');
        });

        it('should return 404 for non-existent banner', async () => {
            const res = await request(app).get('/api/banners/99999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /api/banners', () => {
        it('should create a new banner', async () => {
            const res = await request(app)
                .post('/api/banners')
                .send({
                    mediaType: 'image',
                    src: 'https://example.com/new-banner.jpg',
                    title: 'New Banner',
                    link: '/new',
                    status: 'Active',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe('New Banner');
        });
    });

    describe('PUT /api/banners/:id', () => {
        it('should update an existing banner', async () => {
            const banner = await Banner.create({
                mediaType: 'image',
                src: 'https://example.com/update.jpg',
                title: 'Update Test',
                link: '/update',
                status: 'Active',
            });

            const res = await request(app)
                .put(`/api/banners/${banner.id}`)
                .send({
                    title: 'Updated Banner',
                    status: 'Inactive',
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Updated Banner');
            expect(res.body.status).toBe('Inactive');
        });

        it('should return error for non-existent banner', async () => {
            const res = await request(app)
                .put('/api/banners/99999')
                .send({
                    title: 'Updated',
                });
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /api/banners/:id', () => {
        it('should delete a banner', async () => {
            const banner = await Banner.create({
                mediaType: 'image',
                src: 'https://example.com/delete.jpg',
                title: 'Delete Test',
                link: '/delete',
                status: 'Active',
            });

            const res = await request(app).delete(`/api/banners/${banner.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Banner deleted successfully');
        });

        it('should return error for non-existent banner', async () => {
            const res = await request(app).delete('/api/banners/99999');
            expect(res.statusCode).toEqual(404);
        });
    });
});
