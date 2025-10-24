const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage for different resource types
const createCloudinaryStorage = (folder, resourceType = 'image') => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `lady-vanessa/${folder}`,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' }, // Limit max dimensions
                { quality: 'auto' }, // Auto quality optimization
                { fetch_format: 'auto' }, // Auto format selection
            ],
        },
    });
};

module.exports = {
    cloudinary,
    createCloudinaryStorage,
};
