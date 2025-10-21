const GenderSection = require('../models/GenderSection');

class GenderSectionService {
    async getAllGenderSections() {
        try {
            return await GenderSection.findAll();
        } catch (error) {
            throw new Error('Error fetching gender sections: ' + error.message);
        }
    }

    async getGenderSectionById(id) {
        try {
            return await GenderSection.findByPk(id);
        } catch (error) {
            throw new Error('Error fetching gender section: ' + error.message);
        }
    }

    async getGenderSectionByGender(gender) {
        try {
            return await GenderSection.findOne({ where: { gender } });
        } catch (error) {
            throw new Error('Error fetching gender section: ' + error.message);
        }
    }

    async createGenderSection(genderSectionData) {
        try {
            return await GenderSection.create(genderSectionData);
        } catch (error) {
            throw new Error('Error creating gender section: ' + error.message);
        }
    }

    async updateGenderSection(id, genderSectionData) {
        try {
            const genderSection = await GenderSection.findByPk(id);
            if (!genderSection) {
                return null;
            }
            await genderSection.update(genderSectionData);
            return genderSection;
        } catch (error) {
            throw new Error('Error updating gender section: ' + error.message);
        }
    }

    async deleteGenderSection(id) {
        try {
            const genderSection = await GenderSection.findByPk(id);
            if (!genderSection) {
                return null;
            }
            await genderSection.destroy();
            return { message: 'Gender section deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting gender section: ' + error.message);
        }
    }
}

module.exports = new GenderSectionService();
