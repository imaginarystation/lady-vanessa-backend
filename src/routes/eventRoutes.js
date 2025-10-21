const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

// All routes are public for now (can be protected later with authenticate middleware)
router.get('/', eventController.getAllEvents);
router.get('/active', eventController.getActiveEvent);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
