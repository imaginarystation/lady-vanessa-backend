const express = require('express');
const genderSectionController = require('../controllers/genderSectionController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', genderSectionController.getAllGenderSections);
router.get('/gender/:gender', genderSectionController.getGenderSectionByGender);
router.get('/:id', genderSectionController.getGenderSectionById);

// Protected admin routes
router.post('/', authenticate, genderSectionController.createGenderSection);
router.put('/:id', authenticate, genderSectionController.updateGenderSection);
router.delete('/:id', authenticate, genderSectionController.deleteGenderSection);

module.exports = router;
