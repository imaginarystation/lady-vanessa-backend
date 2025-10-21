const express = require('express');
const genderSectionController = require('../controllers/genderSectionController');

const router = express.Router();

// All routes are public for now (can be protected later with authenticate middleware)
router.get('/', genderSectionController.getAllGenderSections);
router.get('/gender/:gender', genderSectionController.getGenderSectionByGender);
router.get('/:id', genderSectionController.getGenderSectionById);
router.post('/', genderSectionController.createGenderSection);
router.put('/:id', genderSectionController.updateGenderSection);
router.delete('/:id', genderSectionController.deleteGenderSection);

module.exports = router;
