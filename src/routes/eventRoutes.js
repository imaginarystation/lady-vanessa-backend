const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/active', eventController.getActiveEvent);
router.get('/:id', eventController.getEventById);

// Protected admin routes
router.post('/', authenticate, eventController.createEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);

module.exports = router;
