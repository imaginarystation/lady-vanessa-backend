# Lady Vanessa Backend - TODO List

## Critical Bugs to Fix (Priority 1)

### 1. OrderService Missing Methods
- [x] Add `getAllOrders()` method to OrderService
- [x] Add `getOrderById()` method to OrderService (currently has `getOrderDetails()` which is similar)
- [x] Add `updateOrder()` method to OrderService (currently only has `updateOrderStatus()`)
- [x] Ensure OrderController properly calls the correct service methods

### 2. ProductService ORM Inconsistency
- [x] Fix ProductService to use Sequelize methods instead of Mongoose
  - Replace `findById()` with `findByPk()`
  - Replace `save()` with Sequelize `create()`
  - Replace `findByIdAndUpdate()` with Sequelize `update()`
  - Replace `findByIdAndDelete()` with Sequelize `destroy()`
  - Replace `findAll()` with proper Sequelize query

### 3. OrderItemController and Routes Mismatch
- [x] Align OrderItemController method names with routes:
  - `addItemsToOrder()` (route expects this but controller has `createOrderItem()`)
  - `getItemsByOrderId()` (matches)
  - `updateOrderItem()` (matches)
  - `removeOrderItem()` (route expects this but controller has `deleteOrderItem()`)
- [x] Update OrderItemService to match expected functionality

### 4. Order Creation Flow
- [x] Fix `createOrder()` in OrderController to accept orderItems
- [x] Ensure orderItems are properly passed to OrderService.createOrder()

## Feature Additions (Priority 2)

### 5. Admin Functionality
- [x] Create AdminController with CRUD operations
- [x] Create AdminService with business logic
- [x] Create admin routes (/api/admin)
- [x] Add admin login/authentication endpoint
- [ ] Add admin-specific operations (manage products, orders, users)

### 6. Authentication & Authorization
- [x] Create authentication middleware to verify JWT tokens
- [ ] Create authorization middleware to check user roles (user vs admin)
- [ ] Protect routes that require authentication
- [ ] Protect admin routes with admin-only middleware

### 7. User Management Enhancements
- [ ] Add user profile endpoints (GET, PUT /api/users/profile)
- [ ] Add password change functionality
- [ ] Add user order history endpoint
- [x] Fix user login to use Sequelize properly (currently uses Mongoose .findOne())

### 8. Product Management Enhancements
- [ ] Add product search functionality
- [ ] Add product filtering by category
- [ ] Add pagination for product listings
- [ ] Add product image upload/management
- [ ] Add stock management (decrement on order, increment on cancellation)

### 9. Order Management Enhancements
- [ ] Add order status workflow validation
- [ ] Add order history for users
- [ ] Add order filtering (by status, date, user)
- [ ] Add order total calculation based on items
- [ ] Add inventory check before order creation

### 10. Order Items Enhancements
- [ ] Add validation for product existence when adding items
- [ ] Add price calculation based on product price and quantity
- [ ] Add stock availability check

## Code Quality & Best Practices (Priority 3)

### 11. Error Handling
- [ ] Implement centralized error handling middleware
- [ ] Create custom error classes for different error types
- [ ] Standardize error responses across all endpoints
- [ ] Add input validation middleware (express-validator)

### 12. Testing
- [ ] Set up Jest test configuration
- [ ] Add unit tests for services
- [ ] Add integration tests for controllers
- [ ] Add API endpoint tests using supertest
- [ ] Add test database configuration

### 13. Database
- [ ] Add database migrations using Sequelize CLI
- [ ] Add database seeders for development
- [ ] Add proper indexes for performance
- [ ] Add database connection error handling
- [ ] Configure separate test database

### 14. Security
- [ ] Add rate limiting middleware
- [ ] Add helmet for security headers
- [ ] Add input sanitization
- [ ] Add CORS configuration
- [ ] Add password strength validation
- [ ] Add password reset functionality
- [ ] Add email verification

### 15. Documentation
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Document all endpoints with examples
- [ ] Add setup instructions to README
- [ ] Document environment variables
- [ ] Add database schema documentation

### 16. Code Organization
- [ ] Add validation schemas directory
- [ ] Add middleware directory structure
- [ ] Add constants/config files
- [ ] Add utility functions directory
- [ ] Consistent error handling across all services

## DevOps & Deployment (Priority 4)

### 17. Development Workflow
- [ ] Add nodemon configuration for development
- [ ] Add ESLint configuration
- [ ] Add Prettier configuration
- [ ] Add pre-commit hooks (husky)
- [ ] Add npm scripts for common tasks

### 18. Environment Configuration
- [x] Document required environment variables
- [x] Add .env.example file
- [ ] Add environment-specific configurations
- [ ] Add configuration validation

### 19. Logging
- [ ] Add logging middleware (Winston/Morgan)
- [ ] Add request logging
- [ ] Add error logging
- [ ] Add log rotation

## Additional Features (Priority 5)

### 20. Cart Functionality
- [ ] Create Cart model
- [ ] Create CartItem model
- [ ] Create cart endpoints (add, remove, update quantity, clear)
- [ ] Create checkout endpoint that converts cart to order

### 21. Payment Integration
- [ ] Add payment gateway integration (Stripe/PayPal)
- [ ] Add payment model to track transactions
- [ ] Add payment status to orders

### 22. Email Notifications
- [ ] Set up email service (SendGrid/Nodemailer)
- [ ] Send order confirmation emails
- [ ] Send order status update emails
- [ ] Send welcome emails on registration

### 23. Reviews & Ratings
- [ ] Create Review model
- [ ] Add review endpoints (create, read, update, delete)
- [ ] Add rating calculation for products
- [ ] Add review moderation for admins

### 24. Wishlist
- [ ] Create Wishlist model
- [ ] Add wishlist endpoints (add, remove, get)
- [ ] Associate wishlist with users

## Current Status
- Basic CRUD operations implemented for Users, Products, Orders, OrderItems
- Database models defined using Sequelize
- Express server configured with basic routes
- Multiple critical bugs identified that need immediate fixing
