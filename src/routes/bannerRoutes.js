const express = require('express');
const bannerController = require('../controllers/bannerController');

const router = express.Router();

// All routes are public for now (can be protected later with authenticate middleware)
router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', bannerController.createBanner);
router.put('/:id', bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
