const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/upload');
const UploadService = require('../services/uploadService');

/**
 * Upload single image
 * Route: POST /api/upload/:type
 * Supported types: product, user, banner, perfume, category, event, gender-section
 */
router.post('/:type', (req, res, next) => {
    const { type } = req.params;
    
    // Map type to middleware
    const middlewareMap = {
        'product': uploadMiddleware.product,
        'user': uploadMiddleware.userProfile,
        'banner': uploadMiddleware.banner,
        'perfume': uploadMiddleware.perfume,
        'category': uploadMiddleware.category,
        'event': uploadMiddleware.event,
        'gender-section': uploadMiddleware.genderSection,
    };

    const middleware = middlewareMap[type];
    
    if (!middleware) {
        return res.status(400).json({ 
            success: false, 
            message: `Invalid upload type: ${type}` 
        });
    }

    // Apply middleware
    middleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }

        // Return uploaded file info
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: req.file.path,
                filename: req.file.filename,
                size: req.file.size,
            },
        });
    });
});

/**
 * Upload multiple images (for products)
 * Route: POST /api/upload/product-images
 */
router.post('/product-images', uploadMiddleware.productImages, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No files uploaded' 
            });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            filename: file.filename,
            size: file.size,
        }));

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            data: uploadedFiles,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading files', 
            error: error.message 
        });
    }
});

/**
 * Delete an image
 * Route: DELETE /api/upload
 * Body: { imageUrl: "https://..." }
 */
router.delete('/', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image URL is required' 
            });
        }

        const result = await UploadService.deleteImage(imageUrl);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || 'Error deleting image',
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting image', 
            error: error.message 
        });
    }
});

/**
 * Delete multiple images
 * Route: DELETE /api/upload/multiple
 * Body: { imageUrls: ["https://...", "https://..."] }
 */
router.delete('/multiple', async (req, res) => {
    try {
        const { imageUrls } = req.body;

        if (!imageUrls || !Array.isArray(imageUrls)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Image URLs array is required' 
            });
        }

        const result = await UploadService.deleteMultipleImages(imageUrls);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Images deleted successfully',
                results: result.results,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error deleting images',
                error: result.error,
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting images', 
            error: error.message 
        });
    }
});

module.exports = router;
