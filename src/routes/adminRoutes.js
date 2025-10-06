const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminController.login);
router.post('/register', adminController.register);

// Protected routes (require authentication)
router.get('/', authenticate, adminController.getAllAdmins);
router.get('/:id', authenticate, adminController.getAdminById);
router.put('/:id', authenticate, adminController.updateAdmin);
router.delete('/:id', authenticate, adminController.deleteAdmin);

module.exports = router;
