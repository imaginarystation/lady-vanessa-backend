# lady-vanessa-backend

Backend API for Lady Vanessa E-commerce Platform

## Features

- **User Management**: Registration, login with JWT authentication
- **Product Management**: CRUD operations for products
- **Order Management**: Complete order lifecycle management
- **Order Items**: Manage items within orders
- **Admin Panel**: Admin authentication and management
- **Authentication**: JWT-based authentication middleware

## Tech Stack

- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing

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


## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

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

## Environment Variables

See `.env.example` for required environment variables:

- `DB_URL` - PostgreSQL database connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development/production)

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

### Bug Fixes
- Fixed OrderService missing methods (getAllOrders, getOrderById, updateOrder)
- Fixed ProductService ORM inconsistency (Mongoose → Sequelize)
- Fixed OrderItemController/Route method name mismatch
- Fixed UserController to use Sequelize properly

### New Features
- Added authentication middleware for JWT verification
- Added complete Admin functionality (routes, controller, service)
- Added orderItem routes to main application
- Added .env.example for environment configuration

## TODO

See [TODO.md](./TODO.md) for the complete list of planned features and improvements.

## License

ISC