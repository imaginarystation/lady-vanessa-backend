const Product = require('../models/productModel');

class ProductService {
    async createProduct(data) {
        try {
            const product = new Product(data);
            return await product.save();
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error fetching product: ' + error.message);
        }
    }

    async getAllProducts() {
        try {
            return await Product.findAll();
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    async updateProduct(productId, data) {
        try {
            const product = await Product.findByIdAndUpdate(productId, data, {
                new: true,
                runValidators: true,
            });
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await Product.findByIdAndDelete(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }
}

module.exports = new ProductService();