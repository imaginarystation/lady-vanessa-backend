const express = require('express');
const perfumeController = require('../controllers/perfumeController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', perfumeController.getAllPerfumes);
router.get('/search', perfumeController.searchPerfumes);
router.get('/:id', perfumeController.getPerfumeById);

// Protected admin routes
router.post('/', authenticate, perfumeController.createPerfume);
router.put('/:id', authenticate, perfumeController.updatePerfume);
router.delete('/:id', authenticate, perfumeController.deletePerfume);

module.exports = router;
