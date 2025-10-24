const multer = require('multer');
const { createCloudinaryStorage } = require('../config/cloudinaryConfig');

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
};

// Create upload middleware for different resource types
const createUploadMiddleware = (folder, fieldName = 'image', maxCount = 1) => {
    const storage = createCloudinaryStorage(folder);
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880), // 5MB default
        },
    });

    // Return appropriate middleware based on maxCount
    if (maxCount === 1) {
        return upload.single(fieldName);
    } else {
        return upload.array(fieldName, maxCount);
    }
};

// Upload middleware for different entities
const uploadMiddleware = {
    // Single image upload
    product: createUploadMiddleware('products', 'image', 1),
    productImages: createUploadMiddleware('products', 'images', 5), // Max 5 images
    userProfile: createUploadMiddleware('users', 'profilePicture', 1),
    banner: createUploadMiddleware('banners', 'image', 1),
    perfume: createUploadMiddleware('perfumes', 'image', 1),
    category: createUploadMiddleware('categories', 'image', 1),
    event: createUploadMiddleware('events', 'image', 1),
    genderSection: createUploadMiddleware('gender-sections', 'image', 1),
};

module.exports = uploadMiddleware;
