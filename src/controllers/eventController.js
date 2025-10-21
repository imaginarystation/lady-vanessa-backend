const EventService = require('../services/eventService');

class EventController {
    async getAllEvents(req, res) {
        try {
            const events = await EventService.getAllEvents();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching events', error: error.message });
        }
    }

    async getEventById(req, res) {
        try {
            const event = await EventService.getEventById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching event', error: error.message });
        }
    }

    async getActiveEvent(req, res) {
        try {
            const event = await EventService.getActiveEvent();
            if (!event) {
                return res.status(404).json({ message: 'No active event found' });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching active event', error: error.message });
        }
    }

    async createEvent(req, res) {
        try {
            const newEvent = await EventService.createEvent(req.body);
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(500).json({ message: 'Error creating event', error: error.message });
        }
    }

    async updateEvent(req, res) {
        try {
            const updatedEvent = await EventService.updateEvent(req.params.id, req.body);
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: 'Error updating event', error: error.message });
        }
    }

    async deleteEvent(req, res) {
        try {
            const result = await EventService.deleteEvent(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting event', error: error.message });
        }
    }
}

module.exports = new EventController();
