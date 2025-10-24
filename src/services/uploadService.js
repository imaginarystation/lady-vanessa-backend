const { cloudinary } = require('../config/cloudinaryConfig');

/**
 * Upload Service for managing file uploads and deletions
 */
class UploadService {
    /**
     * Delete an image from Cloudinary
     * @param {string} imageUrl - The URL of the image to delete
     * @returns {Promise<Object>} - Result of the deletion
     */
    static async deleteImage(imageUrl) {
        try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
            const publicId = this.extractPublicId(imageUrl);
            
            if (!publicId) {
                return { success: false, message: 'Invalid image URL' };
            }

            const result = await cloudinary.uploader.destroy(publicId);
            return { success: true, result };
        } catch (error) {
            console.error('Error deleting image:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete multiple images from Cloudinary
     * @param {string[]} imageUrls - Array of image URLs to delete
     * @returns {Promise<Object>} - Results of the deletions
     */
    static async deleteMultipleImages(imageUrls) {
        try {
            const deletePromises = imageUrls.map(url => this.deleteImage(url));
            const results = await Promise.all(deletePromises);
            return { success: true, results };
        } catch (error) {
            console.error('Error deleting multiple images:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     * @param {string} imageUrl - The Cloudinary image URL
     * @returns {string|null} - The public_id or null if invalid
     */
    static extractPublicId(imageUrl) {
        if (!imageUrl || typeof imageUrl !== 'string') {
            return null;
        }

        try {
            // Match pattern: .../upload/v{version}/{folder}/{public_id}.{format}
            const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            return matches ? matches[1] : null;
        } catch (error) {
            console.error('Error extracting public_id:', error);
            return null;
        }
    }

    /**
     * Get optimized image URL with transformations
     * @param {string} imageUrl - The original Cloudinary image URL
     * @param {Object} options - Transformation options (width, height, crop, quality, etc.)
     * @returns {string} - The transformed image URL
     */
    static getOptimizedImageUrl(imageUrl, options = {}) {
        if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
            return imageUrl;
        }

        const {
            width = null,
            height = null,
            crop = 'limit',
            quality = 'auto',
            format = 'auto',
        } = options;

        try {
            // Build transformation string
            const transformations = [];
            if (width || height) {
                transformations.push(`w_${width || 'auto'},h_${height || 'auto'},c_${crop}`);
            }
            transformations.push(`q_${quality}`);
            transformations.push(`f_${format}`);

            const transformString = transformations.join(',');
            
            // Insert transformation into URL
            return imageUrl.replace('/upload/', `/upload/${transformString}/`);
        } catch (error) {
            console.error('Error creating optimized URL:', error);
            return imageUrl;
        }
    }
}

module.exports = UploadService;
