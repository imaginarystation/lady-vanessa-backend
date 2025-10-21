const express = require('express');
const perfumeController = require('../controllers/perfumeController');

const router = express.Router();

// All routes are public for now (can be protected later with authenticate middleware)
router.get('/', perfumeController.getAllPerfumes);
router.get('/search', perfumeController.searchPerfumes);
router.get('/:id', perfumeController.getPerfumeById);
router.post('/', perfumeController.createPerfume);
router.put('/:id', perfumeController.updatePerfume);
router.delete('/:id', perfumeController.deletePerfume);

module.exports = router;
