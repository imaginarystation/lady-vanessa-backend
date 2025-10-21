const express = require('express');
const bannerController = require('../controllers/bannerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);

// Protected admin routes
router.post('/', authenticate, bannerController.createBanner);
router.put('/:id', authenticate, bannerController.updateBanner);
router.delete('/:id', authenticate, bannerController.deleteBanner);

module.exports = router;
