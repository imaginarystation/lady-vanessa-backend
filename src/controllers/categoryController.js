const CategoryService = require('../services/categoryService');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching categories', error: error.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching category', error: error.message });
        }
    }

    async createCategory(req, res) {
        try {
            const newCategory = await CategoryService.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error creating category', error: error.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error updating category', error: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const result = await CategoryService.deleteCategory(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting category', error: error.message });
        }
    }
}

module.exports = new CategoryController();
