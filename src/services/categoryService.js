const Category = require('../models/Category');

class CategoryService {
    async getAllCategories() {
        try {
            return await Category.findAll();
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    }

    async getCategoryById(id) {
        try {
            return await Category.findByPk(id);
        } catch (error) {
            throw new Error('Error fetching category: ' + error.message);
        }
    }

    async createCategory(categoryData) {
        try {
            return await Category.create(categoryData);
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    async updateCategory(id, categoryData) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return null;
            }
            await category.update(categoryData);
            return category;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return null;
            }
            await category.destroy();
            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    }
}

module.exports = new CategoryService();
