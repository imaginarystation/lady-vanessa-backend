const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminController.login);
router.post('/register', adminController.register);

// Admin Product Management routes (must come before /:id routes)
router.get('/products', authenticate, adminController.getProducts);
router.post('/products', authenticate, adminController.createProduct);
router.put('/products/:id', authenticate, adminController.updateProduct);
router.delete('/products/:id', authenticate, adminController.deleteProduct);

// Admin Order Management routes
router.get('/orders', authenticate, adminController.getOrders);
router.put('/orders/:id', authenticate, adminController.updateOrder);

// Admin User Management routes
router.get('/users', authenticate, adminController.getUsers);
router.post('/users', authenticate, adminController.createUser);
router.get('/users/:id', authenticate, adminController.getUserById);
router.put('/users/:id', authenticate, adminController.updateUser);
router.delete('/users/:id', authenticate, adminController.deleteUser);

// Protected admin routes (must come after specific routes)
router.get('/', authenticate, adminController.getAllAdmins);
router.get('/:id', authenticate, adminController.getAdminById);
router.put('/:id', authenticate, adminController.updateAdmin);
router.delete('/:id', authenticate, adminController.deleteAdmin);
// User management routes (require authentication)
router.get('/users', authenticate, adminController.getAllUsers);
router.get('/users/:id', authenticate, adminController.getUserById);
router.put('/users/:id', authenticate, adminController.updateUser);
router.delete('/users/:id', authenticate, adminController.deleteUser);

module.exports = router;
