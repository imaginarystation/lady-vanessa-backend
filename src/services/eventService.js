const Event = require('../models/Event');

class EventService {
    async getAllEvents() {
        try {
            return await Event.findAll();
        } catch (error) {
            throw new Error('Error fetching events: ' + error.message);
        }
    }

    async getEventById(id) {
        try {
            return await Event.findByPk(id);
        } catch (error) {
            throw new Error('Error fetching event: ' + error.message);
        }
    }

    async getActiveEvent() {
        try {
            return await Event.findOne({ where: { isActive: true } });
        } catch (error) {
            throw new Error('Error fetching active event: ' + error.message);
        }
    }

    async createEvent(eventData) {
        try {
            return await Event.create(eventData);
        } catch (error) {
            throw new Error('Error creating event: ' + error.message);
        }
    }

    async updateEvent(id, eventData) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                return null;
            }
            await event.update(eventData);
            return event;
        } catch (error) {
            throw new Error('Error updating event: ' + error.message);
        }
    }

    async deleteEvent(id) {
        try {
            const event = await Event.findByPk(id);
            if (!event) {
                return null;
            }
            await event.destroy();
            return { message: 'Event deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting event: ' + error.message);
        }
    }
}

module.exports = new EventService();
