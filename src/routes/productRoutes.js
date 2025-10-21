const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Route to get all products (with optional filters)
router.get('/', productController.getAllProducts);

// Route to search products
router.get('/search', productController.searchProducts);

// Route to get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Route to get a single product by ID
router.get('/:id', productController.getProductById);

// Route to create a new product
router.post('/', productController.createProduct);

// Route to update a product by ID
router.put('/:id', productController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;