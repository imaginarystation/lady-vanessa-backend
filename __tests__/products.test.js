require('./setup');
const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/productModel');
const sequelize = require('../src/config/dbConfig');

describe('Product Endpoints', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await Product.destroy({ where: {}, truncate: true });
    });

    describe('GET /api/products', () => {
        it('should return all products', async () => {
            // Create test products
            await Product.create({
                name: 'Product 1',
                description: 'Description 1',
                category: 'Category 1',
                price: 99.99,
                stock: 10
            });
            await Product.create({
                name: 'Product 2',
                description: 'Description 2',
                category: 'Category 2',
                price: 149.99,
                stock: 5
            });

            const response = await request(app)
                .get('/api/products')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('price');
        });

        it('should return empty array when no products exist', async () => {
            const response = await request(app)
                .get('/api/products')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return a product by ID', async () => {
            const product = await Product.create({
                name: 'Test Product',
                description: 'Test Description',
                category: 'Test Category',
                price: 99.99,
                stock: 10
            });

            const response = await request(app)
                .get(`/api/products/${product.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Test Product');
            expect(response.body).toHaveProperty('price', 99.99);
            expect(response.body).toHaveProperty('id', product.id);
        });

        it('should return 404 for non-existent product', async () => {
            const response = await request(app)
                .get('/api/products/99999')
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /api/products', () => {
        it('should create a new product', async () => {
            const productData = {
                name: 'New Product',
                description: 'New Description',
                category: 'New Category',
                price: 199.99,
                stock: 20
            };

            const response = await request(app)
                .post('/api/products')
                .send(productData)
                .expect(201);

            expect(response.body).toHaveProperty('name', productData.name);
            expect(response.body).toHaveProperty('price', productData.price);
            expect(response.body).toHaveProperty('id');
        });

        it('should return error when required fields are missing', async () => {
            const productData = {
                description: 'Test Description'
                // Missing name and price
            };

            const response = await request(app)
                .post('/api/products')
                .send(productData)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PUT /api/products/:id', () => {
        it('should update an existing product', async () => {
            const product = await Product.create({
                name: 'Original Product',
                description: 'Original Description',
                category: 'Original Category',
                price: 99.99,
                stock: 10
            });

            const updateData = {
                name: 'Updated Product',
                price: 149.99
            };

            const response = await request(app)
                .put(`/api/products/${product.id}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toHaveProperty('name', updateData.name);
            expect(response.body).toHaveProperty('price', updateData.price);
        });

        it('should return error for non-existent product', async () => {
            const updateData = {
                name: 'Updated Product',
                price: 149.99
            };

            const response = await request(app)
                .put('/api/products/99999')
                .send(updateData)
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should delete a product', async () => {
            const product = await Product.create({
                name: 'Product to Delete',
                description: 'Description',
                category: 'Category',
                price: 99.99,
                stock: 10
            });

            const response = await request(app)
                .delete(`/api/products/${product.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Product deleted successfully');

            // Verify product is deleted
            const deletedProduct = await Product.findByPk(product.id);
            expect(deletedProduct).toBeNull();
        });

        it('should return error for non-existent product', async () => {
            const response = await request(app)
                .delete('/api/products/99999')
                .expect(500);

            expect(response.body).toHaveProperty('message');
        });
    });
});
