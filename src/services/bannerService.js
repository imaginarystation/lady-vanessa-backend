const Banner = require('../models/Banner');

class BannerService {
    async getAllBanners() {
        try {
            return await Banner.findAll();
        } catch (error) {
            throw new Error('Error fetching banners: ' + error.message);
        }
    }

    async getBannerById(id) {
        try {
            return await Banner.findByPk(id);
        } catch (error) {
            throw new Error('Error fetching banner: ' + error.message);
        }
    }

    async createBanner(bannerData) {
        try {
            return await Banner.create(bannerData);
        } catch (error) {
            throw new Error('Error creating banner: ' + error.message);
        }
    }

    async updateBanner(id, bannerData) {
        try {
            const banner = await Banner.findByPk(id);
            if (!banner) {
                return null;
            }
            await banner.update(bannerData);
            return banner;
        } catch (error) {
            throw new Error('Error updating banner: ' + error.message);
        }
    }

    async deleteBanner(id) {
        try {
            const banner = await Banner.findByPk(id);
            if (!banner) {
                return null;
            }
            await banner.destroy();
            return { message: 'Banner deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting banner: ' + error.message);
        }
    }
}

module.exports = new BannerService();
