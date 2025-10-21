require('./setup');
const request = require('supertest');
const app = require('../src/app');
const { Event } = require('../src/models');
const sequelize = require('../src/config/dbConfig');

describe('Event Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/events', () => {
        it('should return all events', async () => {
            await Event.create({
                title: 'Fashion Show 2025',
                subtitle: 'The Echo of Elegance',
                isActive: true,
            });

            const res = await request(app).get('/api/events');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return empty array when no events exist', async () => {
            await Event.destroy({ where: {} });
            const res = await request(app).get('/api/events');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });
    });

    describe('GET /api/events/active', () => {
        it('should return the active event', async () => {
            await Event.destroy({ where: {} });
            await Event.create({
                title: 'Inactive Event',
                isActive: false,
            });
            await Event.create({
                title: 'Active Event',
                isActive: true,
            });

            const res = await request(app).get('/api/events/active');
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Active Event');
            expect(res.body.isActive).toBe(true);
        });

        it('should return 404 when no active event exists', async () => {
            await Event.destroy({ where: {} });
            const res = await request(app).get('/api/events/active');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('GET /api/events/:id', () => {
        it('should return an event by ID', async () => {
            const event = await Event.create({
                title: 'Test Event',
                subtitle: 'Test subtitle',
                isActive: true,
            });

            const res = await request(app).get(`/api/events/${event.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Test Event');
        });

        it('should return 404 for non-existent event', async () => {
            const res = await request(app).get('/api/events/99999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /api/events', () => {
        it('should create a new event', async () => {
            const res = await request(app)
                .post('/api/events')
                .send({
                    title: 'New Event',
                    subtitle: 'New subtitle',
                    isActive: true,
                    eventDetails: {
                        date: '2025-10-26',
                        time: '7:00 PM',
                        location: 'Accra',
                    },
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe('New Event');
        });
    });

    describe('PUT /api/events/:id', () => {
        it('should update an existing event', async () => {
            const event = await Event.create({
                title: 'Update Test',
                isActive: true,
            });

            const res = await request(app)
                .put(`/api/events/${event.id}`)
                .send({
                    title: 'Updated Event',
                    isActive: false,
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe('Updated Event');
            expect(res.body.isActive).toBe(false);
        });

        it('should return error for non-existent event', async () => {
            const res = await request(app)
                .put('/api/events/99999')
                .send({
                    title: 'Updated',
                });
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /api/events/:id', () => {
        it('should delete an event', async () => {
            const event = await Event.create({
                title: 'Delete Test',
                isActive: true,
            });

            const res = await request(app).delete(`/api/events/${event.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Event deleted successfully');
        });

        it('should return error for non-existent event', async () => {
            const res = await request(app).delete('/api/events/99999');
            expect(res.statusCode).toEqual(404);
        });
    });
});
