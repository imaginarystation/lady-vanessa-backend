# File Upload Implementation Guide

## Overview

This document describes the cloud-based file upload system implemented for the Lady Vanessa e-commerce backend. The system uses **Cloudinary** for scalable, reliable, and CDN-backed image storage.

## Architecture

### Components

1. **Cloudinary Configuration** (`src/config/cloudinaryConfig.js`)
   - Configures Cloudinary SDK with credentials
   - Creates storage instances for different resource types
   - Applies automatic image optimization

2. **Upload Middleware** (`src/middleware/upload.js`)
   - Handles file upload using Multer
   - Validates file types and sizes
   - Supports single and multiple file uploads
   - Provides entity-specific upload handlers

3. **Upload Service** (`src/services/uploadService.js`)
   - Provides utility functions for image management
   - Handles image deletion from Cloudinary
   - Extracts public IDs from URLs
   - Generates optimized image URLs

4. **Upload Routes** (`src/routes/uploadRoutes.js`)
   - RESTful API endpoints for file operations
   - Upload single/multiple images
   - Delete single/multiple images

## Setup Instructions

### 1. Sign Up for Cloudinary

1. Visit [Cloudinary.com](https://cloudinary.com) and create a free account
2. Navigate to the dashboard to find your credentials
3. Copy your Cloud Name, API Key, and API Secret

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAX_FILE_SIZE=5242880  # 5MB in bytes (optional, defaults to 5MB)
```

### 3. Install Dependencies

The following packages are already included in `package.json`:

```bash
npm install multer@2.0.2 cloudinary@1.41.3 multer-storage-cloudinary@4.0.0 sharp@0.33.5
```

## API Usage

### Upload Single Image

**Endpoint:** `POST /api/upload/:type`

**Supported Types:**
- `product` - Product main image
- `user` - User profile picture
- `banner` - Banner image
- `perfume` - Perfume product image
- `category` - Category image
- `event` - Event image
- `gender-section` - Gender section image

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload/product \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../lady-vanessa/products/abc123.jpg",
    "filename": "abc123",
    "size": 245678
  }
}
```

### Upload Multiple Product Images

**Endpoint:** `POST /api/upload/product-images`

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload/product-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../lady-vanessa/products/abc123.jpg",
      "filename": "abc123",
      "size": 245678
    },
    {
      "url": "https://res.cloudinary.com/.../lady-vanessa/products/def456.jpg",
      "filename": "def456",
      "size": 198765
    }
  ]
}
```

### Delete Single Image

**Endpoint:** `DELETE /api/upload`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://res.cloudinary.com/.../sample.jpg"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### Delete Multiple Images

**Endpoint:** `DELETE /api/upload/multiple`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/upload/multiple \
  -H "Content-Type: application/json" \
  -d '{"imageUrls": ["https://...", "https://..."]}'
```

**Response:**
```json
{
  "success": true,
  "message": "Images deleted successfully",
  "results": [
    {"success": true, "result": {...}},
    {"success": true, "result": {...}}
  ]
}
```

## Features

### Automatic Image Optimization

All uploaded images are automatically optimized with:
- Maximum dimensions: 1000x1000px (maintains aspect ratio)
- Auto quality optimization
- Auto format selection (WebP for modern browsers)

### File Validation

- **Allowed formats:** JPEG, PNG, GIF, WebP
- **File size limit:** Configurable via `MAX_FILE_SIZE` (default: 5MB)
- **Type validation:** MIME type checking
- **Security:** Cloudinary signed uploads

### Organized Storage

Images are organized in folders by entity type:
```
lady-vanessa/
├── products/
├── users/
├── banners/
├── perfumes/
├── categories/
├── events/
└── gender-sections/
```

## Utility Functions

### Get Optimized Image URL

```javascript
const UploadService = require('./services/uploadService');

// Get optimized image URL with custom transformations
const optimizedUrl = UploadService.getOptimizedImageUrl(originalUrl, {
  width: 500,
  height: 500,
  crop: 'fill',
  quality: 'auto',
  format: 'auto'
});
```

**Transformation Options:**
- `width` - Target width in pixels
- `height` - Target height in pixels
- `crop` - Crop mode (`fill`, `fit`, `limit`, `scale`, etc.)
- `quality` - Image quality (`auto`, `best`, 1-100)
- `format` - Output format (`auto`, `jpg`, `png`, `webp`)

### Extract Public ID

```javascript
const publicId = UploadService.extractPublicId(imageUrl);
// Returns: "lady-vanessa/products/abc123"
```

### Delete Image

```javascript
const result = await UploadService.deleteImage(imageUrl);
// Returns: { success: true/false, result/error }
```

## Integration with Models

The following models have image fields:

### User Model
```javascript
{
  profilePicture: String  // Cloudinary URL
}
```

### Product Model
```javascript
{
  image: String,          // Main product image
  images: JSON/Array      // Additional product images
}
```

### Banner Model
```javascript
{
  src: String             // Banner image/video URL
}
```

### Perfume Model
```javascript
{
  image: String           // Perfume image URL
}
```

## Security Considerations

1. **File Type Validation:** Only image MIME types are allowed
2. **Size Limits:** Enforced via Multer configuration
3. **URL Validation:** Strict validation when extracting public IDs
4. **Cloudinary Signed Uploads:** All uploads are authenticated
5. **Switch Statement:** Used for type validation to prevent dynamic method calls
6. **ReDoS Protection:** Non-backtracking regex patterns used

## Testing

The upload system includes comprehensive tests:

```bash
npm test -- --testNamePattern="Upload"
```

**Test Coverage:**
- Upload service utility functions
- Upload endpoint validation
- Delete endpoint validation
- Error handling
- File type validation

## Troubleshooting

### Upload Fails with "Invalid file type"

**Solution:** Ensure you're uploading JPEG, PNG, GIF, or WebP images.

### Upload Fails with File Size Error

**Solution:** Reduce image size or increase `MAX_FILE_SIZE` in `.env`.

### Cloudinary Authentication Error

**Solution:** Verify your Cloudinary credentials in `.env` file.

### Delete Fails with "Invalid image URL"

**Solution:** Ensure the URL is a valid Cloudinary URL starting with `https://res.cloudinary.com/`.

## Best Practices

1. **Always delete old images** when updating product/user images
2. **Use optimized URLs** for responsive images
3. **Validate image dimensions** on the client side before upload
4. **Compress images** before upload when possible
5. **Use webhooks** for asynchronous upload confirmation (optional)

## Cloudinary Dashboard

Access your Cloudinary dashboard at [cloudinary.com/console](https://cloudinary.com/console) to:
- View uploaded images
- Monitor bandwidth usage
- Configure upload presets
- Set up webhooks
- Manage transformations

## Future Enhancements

Potential improvements for the upload system:

1. Add image processing pipeline (watermarks, filters)
2. Implement video upload support
3. Add direct upload from URLs
4. Implement upload progress tracking
5. Add image moderation/approval workflow
6. Support for PDF and document uploads
7. Implement lazy loading for image galleries
8. Add image compression before upload

## Support

For issues or questions:
- Check Cloudinary documentation: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- Review the codebase in `src/middleware/upload.js` and `src/services/uploadService.js`
- Run tests to verify functionality
