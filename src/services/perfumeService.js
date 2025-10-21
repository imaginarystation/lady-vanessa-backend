const Perfume = require('../models/Perfume');

class PerfumeService {
    async getAllPerfumes(filters = {}) {
        try {
            const where = {};
            
            if (filters.sectionTag) {
                where.sectionTag = filters.sectionTag;
            }
            
            if (filters.minPrice || filters.maxPrice) {
                where.price = {};
                if (filters.minPrice) where.price.$gte = filters.minPrice;
                if (filters.maxPrice) where.price.$lte = filters.maxPrice;
            }
            
            return await Perfume.findAll({ where });
        } catch (error) {
            throw new Error('Error fetching perfumes: ' + error.message);
        }
    }

    async getPerfumeById(id) {
        try {
            return await Perfume.findByPk(id);
        } catch (error) {
            throw new Error('Error fetching perfume: ' + error.message);
        }
    }

    async searchPerfumes(query) {
        try {
            const { Op } = require('sequelize');
            return await Perfume.findAll({
                where: {
                    name: {
                        [Op.like]: `%${query}%`
                    }
                }
            });
        } catch (error) {
            throw new Error('Error searching perfumes: ' + error.message);
        }
    }

    async createPerfume(perfumeData) {
        try {
            return await Perfume.create(perfumeData);
        } catch (error) {
            throw new Error('Error creating perfume: ' + error.message);
        }
    }

    async updatePerfume(id, perfumeData) {
        try {
            const perfume = await Perfume.findByPk(id);
            if (!perfume) {
                return null;
            }
            await perfume.update(perfumeData);
            return perfume;
        } catch (error) {
            throw new Error('Error updating perfume: ' + error.message);
        }
    }

    async deletePerfume(id) {
        try {
            const perfume = await Perfume.findByPk(id);
            if (!perfume) {
                return null;
            }
            await perfume.destroy();
            return { message: 'Perfume deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting perfume: ' + error.message);
        }
    }
}

module.exports = new PerfumeService();
