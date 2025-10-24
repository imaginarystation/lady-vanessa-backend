const Product = require('../models/productModel');

class ProductService {
    async createProduct(data) {
        try {
            const product = await Product.create(data);
            return product;
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error fetching product: ' + error.message);
        }
    }

    async getAllProducts(filters = {}) {
        try {
            const where = {};
            
            if (filters.category) {
                where.category = filters.category;
            }
            
            if (filters.gender) {
                where.gender = filters.gender;
            }
            
            if (filters.status) {
                where.status = filters.status;
            }
            
            if (filters.minPrice || filters.maxPrice) {
                where.price = {};
                if (filters.minPrice) where.price.$gte = parseFloat(filters.minPrice);
                if (filters.maxPrice) where.price.$lte = parseFloat(filters.maxPrice);
            }
            
            return await Product.findAll({ where });
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async getAllProductsPaginated(page = 1, limit = 20, filters = {}) {
        try {
            const where = {};
            
            if (filters.category) {
                where.category = filters.category;
            }
            
            if (filters.gender) {
                where.gender = filters.gender;
            }
            
            if (filters.status) {
                where.status = filters.status;
            }
            
            if (filters.minPrice || filters.maxPrice) {
                where.price = {};
                if (filters.minPrice) where.price.$gte = parseFloat(filters.minPrice);
                if (filters.maxPrice) where.price.$lte = parseFloat(filters.maxPrice);
            }
            
            const offset = (page - 1) * limit;
            const { count, rows } = await Product.findAndCountAll({
                where,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });
            
            return {
                data: rows,
                total: count,
                page: parseInt(page),
                limit: parseInt(limit)
            };
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async searchProducts(query) {
        try {
            const { Op } = require('sequelize');
            return await Product.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${query}%` } },
                        { description: { [Op.like]: `%${query}%` } },
                        { category: { [Op.like]: `%${query}%` } }
                    ]
                }
            });
        } catch (error) {
            throw new Error('Error searching products: ' + error.message);
        }
    }

    async getProductsByCategory(category) {
        try {
            return await Product.findAll({ where: { category } });
        } catch (error) {
            throw new Error('Error fetching products by category: ' + error.message);
        }
    }

    async updateProduct(productId, data) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.update(data);
            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByPk(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            await product.destroy();
            return product;
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
}

module.exports = new ProductService();