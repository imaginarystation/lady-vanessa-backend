# lady-vanessa-backend

Backend API for Lady Vanessa E-commerce Platform

## Features

- **User Management**: Registration, login with JWT authentication
- **Product Management**: CRUD operations for products with filtering and search
- **Category Management**: Organize products into categories
- **Banner Management**: Manage promotional banners (image/video)
- **Event Management**: Manage fashion shows and events
- **Perfume Management**: Specialized perfume product catalog
- **Gender Sections**: Gender-specific content sections for men/women
- **Order Management**: Complete order lifecycle management
- **Order Items**: Manage items within orders
- **Admin Panel**: Admin authentication and management
- **Authentication**: JWT-based authentication middleware
- **File Upload**: Cloud-based image storage with Cloudinary integration

## Tech Stack

- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Cloudinary** for cloud-based image storage
- **Multer** for file upload handling
- **Sharp** for image optimization

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/imaginarystation/lady-vanessa-backend.git
cd lady-vanessa-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Start the server
```bash
npm start
# or for development with auto-reload
npm run dev
```

## Docker Deployment

The application can be easily deployed using Docker and Docker Compose.

### Prerequisites for Docker

- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)

### Using Docker Compose (Recommended)

The easiest way to run the application with all dependencies:

```bash
# Build and start all services (backend + PostgreSQL)
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (removes all data)
docker compose down -v
```

The application will be available at `http://localhost:5000`

### Using Dockerfile Only

If you have your own database setup:

```bash
# Build the Docker image
docker build -t lady-vanessa-backend .

# Run the container
docker run -d \
  -p 5000:5000 \
  -e DB_URL=postgresql://user:password@host:5432/dbname \
  -e JWT_SECRET=your-secret-key \
  -e NODE_ENV=production \
  --name lady-vanessa-backend \
  lady-vanessa-backend

# View logs
docker logs -f lady-vanessa-backend

# Stop the container
docker stop lady-vanessa-backend
```

### Environment Variables for Docker

When using Docker, you can set environment variables in `docker-compose.yml` or pass them using `-e` flag with `docker run`. Required variables:

- `DB_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (production/development)

### Docker Image Details

- **Base Image**: Node.js 18 Alpine
- **Image Size**: ~128MB (optimized multi-stage build)
- **User**: Non-root user (nodejs) for security
- **Exposed Port**: 5000


## File Upload & Storage

The application uses **Cloudinary** for cloud-based image storage, providing scalable, reliable, and CDN-backed file storage for all media assets.

### Setup Cloudinary

1. Sign up for a free account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the Cloudinary dashboard
3. Add them to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### Upload Features

- **Supported Formats**: JPEG, PNG, GIF, WebP
- **File Size Limit**: Configurable (default 5MB)
- **Automatic Optimization**: Images are automatically optimized for web delivery
- **Image Transformations**: Support for resizing, cropping, and format conversion
- **Multiple Uploads**: Products can have up to 5 images
- **Organized Storage**: Files are organized in folders by entity type (products, users, banners, etc.)

### Upload API Examples

#### Upload Single Image

```bash
# Upload product image
curl -X POST http://localhost:5000/api/upload/product \
  -F "image=@/path/to/image.jpg"

# Upload user profile picture
curl -X POST http://localhost:5000/api/upload/user \
  -F "profilePicture=@/path/to/profile.jpg"
```

Response:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/lady-vanessa/products/abc123.jpg",
    "filename": "abc123",
    "size": 245678
  }
}
```

#### Upload Multiple Product Images

```bash
curl -X POST http://localhost:5000/api/upload/product-images \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

#### Delete Image

```bash
curl -X DELETE http://localhost:5000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg"}'
```

#### Delete Multiple Images

```bash
curl -X DELETE http://localhost:5000/api/upload/multiple \
  -H "Content-Type: application/json" \
  -d '{"imageUrls": ["https://...", "https://..."]}'
```

### Image Optimization

The `UploadService` provides utility methods for getting optimized image URLs:

```javascript
const UploadService = require('./services/uploadService');

// Get optimized image URL with custom dimensions
const optimizedUrl = UploadService.getOptimizedImageUrl(originalUrl, {
  width: 500,
  height: 500,
  crop: 'fill',
  quality: 'auto',
  format: 'auto'
});
```

### Supported Upload Types

- `product` - Product main image
- `user` - User profile picture
- `banner` - Banner image
- `perfume` - Perfume product image
- `category` - Category image
- `event` - Event image
- `gender-section` - Gender section image

### Security & Validation

- File type validation (only images allowed)
- File size limits enforced
- Secure Cloudinary signed uploads
- Public ID extraction for secure deletion
- Error handling for failed uploads/deletions


## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products (supports filters: category, gender, status, minPrice, maxPrice)
- `GET /api/products/search?q=query` - Search products by name, description, or category
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Banners
- `GET /api/banners` - Get all banners
- `GET /api/banners/:id` - Get banner by ID
- `POST /api/banners` - Create new banner
- `PUT /api/banners/:id` - Update banner
- `DELETE /api/banners/:id` - Delete banner

### Events
- `GET /api/events` - Get all events
- `GET /api/events/active` - Get currently active event
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Perfumes
- `GET /api/perfumes` - Get all perfumes (supports filters: sectionTag, minPrice, maxPrice)
- `GET /api/perfumes/search?q=query` - Search perfumes by name
- `GET /api/perfumes/:id` - Get perfume by ID
- `POST /api/perfumes` - Create new perfume
- `PUT /api/perfumes/:id` - Update perfume
- `DELETE /api/perfumes/:id` - Delete perfume

### Gender Sections
- `GET /api/gender-sections` - Get all gender sections
- `GET /api/gender-sections/gender/:gender` - Get gender section by gender (men/women)
- `GET /api/gender-sections/:id` - Get gender section by ID
- `POST /api/gender-sections` - Create new gender section
- `PUT /api/gender-sections/:id` - Update gender section
- `DELETE /api/gender-sections/:id` - Delete gender section

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Order Items
- `POST /api/orders/:orderId/items` - Add items to order
- `GET /api/orders/:orderId/items` - Get items for order
- `PUT /api/orders/items/:id` - Update order item
- `DELETE /api/orders/items/:id` - Remove order item

### Admin
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin` - Get all admins (protected)
- `GET /api/admin/:id` - Get admin by ID (protected)
- `PUT /api/admin/:id` - Update admin (protected)
- `DELETE /api/admin/:id` - Delete admin (protected)

### File Upload
- `POST /api/upload/:type` - Upload single image (type: product, user, banner, perfume, category, event, gender-section)
- `POST /api/upload/product-images` - Upload multiple product images (max 5)
- `DELETE /api/upload` - Delete single image (body: { imageUrl })
- `DELETE /api/upload/multiple` - Delete multiple images (body: { imageUrls: [] })

## Environment Variables

See `.env.example` for required environment variables:

- `DB_URL` - PostgreSQL database connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development/production)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image storage
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `MAX_FILE_SIZE` - Maximum file upload size in bytes (default: 5242880 = 5MB)

## Project Structure

```
src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── config/
│   └── dbConfig.js     # Database configuration
├── controllers/        # Request handlers
├── models/             # Sequelize models
├── routes/             # API routes
├── services/           # Business logic layer
└── middleware/         # Custom middleware (auth, etc.)
```

## Recent Updates

### New Features (Latest)
- **Cloud-Based File Upload System**: Integrated Cloudinary for scalable image storage
  - Support for uploading profile pictures, product images, banners, and other media
  - Automatic image optimization and transformation
  - Multiple image upload support for products (up to 5 images)
  - Secure file handling with type validation and size limits
  - RESTful API endpoints for upload and deletion operations
- **Added Category Management**: Full CRUD operations for product categories
- **Added Banner Management**: Support for image and video banners
- **Added Event Management**: Fashion show and event management system
- **Added Perfume Catalog**: Specialized perfume product management with filtering
- **Added Gender Sections**: Gender-specific content sections (men/women)
- **Enhanced Product Model**: Added image, images array, tags, gender, and status fields
- **Product Search & Filtering**: Search products by name/description, filter by category, gender, price range
- **Comprehensive Test Coverage**: 120 tests covering all endpoints including file uploads

### Previous Updates
- Fixed OrderService missing methods (getAllOrders, getOrderById, updateOrder)
- Fixed ProductService ORM inconsistency (Mongoose → Sequelize)
- Fixed OrderItemController/Route method name mismatch
- Fixed UserController to use Sequelize properly
- Added authentication middleware for JWT verification
- Added complete Admin functionality (routes, controller, service)
- Added orderItem routes to main application
- Added .env.example for environment configuration

## TODO

See [TODO.md](./TODO.md) for the complete list of planned features and improvements.

## License

ISC