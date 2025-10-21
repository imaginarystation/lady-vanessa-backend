const BannerService = require('../services/bannerService');

class BannerController {
    async getAllBanners(req, res) {
        try {
            const banners = await BannerService.getAllBanners();
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching banners', error: error.message });
        }
    }

    async getBannerById(req, res) {
        try {
            const banner = await BannerService.getBannerById(req.params.id);
            if (!banner) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).json(banner);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching banner', error: error.message });
        }
    }

    async createBanner(req, res) {
        try {
            const newBanner = await BannerService.createBanner(req.body);
            res.status(201).json(newBanner);
        } catch (error) {
            res.status(500).json({ message: 'Error creating banner', error: error.message });
        }
    }

    async updateBanner(req, res) {
        try {
            const updatedBanner = await BannerService.updateBanner(req.params.id, req.body);
            if (!updatedBanner) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).json(updatedBanner);
        } catch (error) {
            res.status(500).json({ message: 'Error updating banner', error: error.message });
        }
    }

    async deleteBanner(req, res) {
        try {
            const result = await BannerService.deleteBanner(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Banner not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting banner', error: error.message });
        }
    }
}

module.exports = new BannerController();
