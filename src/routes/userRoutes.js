const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');


const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticate, userController.me);
router.put('/edit', authenticate, userController.editProfile);


module.exports = router;