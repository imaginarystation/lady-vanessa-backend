require('./setup');
const request = require('supertest');
const app = require('../src/app');
const UploadService = require('../src/services/uploadService');

describe('Upload Service', () => {
    describe('extractPublicId', () => {
        it('should extract public_id from Cloudinary URL', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/lady-vanessa/products/sample.jpg';
            const publicId = UploadService.extractPublicId(url);
            expect(publicId).toBe('lady-vanessa/products/sample');
        });

        it('should return null for invalid URL', () => {
            const publicId = UploadService.extractPublicId('invalid-url');
            expect(publicId).toBeNull();
        });

        it('should return null for null input', () => {
            const publicId = UploadService.extractPublicId(null);
            expect(publicId).toBeNull();
        });
    });

    describe('getOptimizedImageUrl', () => {
        it('should add transformations to Cloudinary URL', () => {
            const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
            const optimized = UploadService.getOptimizedImageUrl(url, {
                width: 500,
                height: 500,
                crop: 'fill',
            });
            expect(optimized).toContain('w_500');
            expect(optimized).toContain('h_500');
            expect(optimized).toContain('c_fill');
        });

        it('should return original URL for non-Cloudinary URLs', () => {
            const url = 'https://example.com/image.jpg';
            const optimized = UploadService.getOptimizedImageUrl(url);
            expect(optimized).toBe(url);
        });
    });
});

describe('Upload Endpoints', () => {
    describe('POST /api/upload/:type', () => {
        it('should return error for invalid upload type', async () => {
            const response = await request(app)
                .post('/api/upload/invalid-type')
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message');
        });

        it('should return error when no file is uploaded', async () => {
            const response = await request(app)
                .post('/api/upload/product')
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('No file uploaded');
        });
    });

    describe('DELETE /api/upload', () => {
        it('should return error when imageUrl is missing', async () => {
            const response = await request(app)
                .delete('/api/upload')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('Image URL is required');
        });

        it('should handle delete request with imageUrl', async () => {
            const response = await request(app)
                .delete('/api/upload')
                .send({ imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' });

            expect(response.body).toHaveProperty('success');
        });
    });

    describe('DELETE /api/upload/multiple', () => {
        it('should return error when imageUrls is missing', async () => {
            const response = await request(app)
                .delete('/api/upload/multiple')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('Image URLs array is required');
        });

        it('should return error when imageUrls is not an array', async () => {
            const response = await request(app)
                .delete('/api/upload/multiple')
                .send({ imageUrls: 'not-an-array' })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body.message).toContain('Image URLs array is required');
        });

        it('should handle delete request with imageUrls array', async () => {
            const response = await request(app)
                .delete('/api/upload/multiple')
                .send({ 
                    imageUrls: [
                        'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
                        'https://res.cloudinary.com/demo/image/upload/sample2.jpg'
                    ] 
                });

            expect(response.body).toHaveProperty('success');
        });
    });
});
