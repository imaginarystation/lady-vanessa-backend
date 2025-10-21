const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// All routes are public for now (can be protected later with authenticate middleware)
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
