const GenderSectionService = require('../services/genderSectionService');

class GenderSectionController {
    async getAllGenderSections(req, res) {
        try {
            const genderSections = await GenderSectionService.getAllGenderSections();
            res.status(200).json(genderSections);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching gender sections', error: error.message });
        }
    }

    async getGenderSectionById(req, res) {
        try {
            const genderSection = await GenderSectionService.getGenderSectionById(req.params.id);
            if (!genderSection) {
                return res.status(404).json({ message: 'Gender section not found' });
            }
            res.status(200).json(genderSection);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching gender section', error: error.message });
        }
    }

    async getGenderSectionByGender(req, res) {
        try {
            const genderSection = await GenderSectionService.getGenderSectionByGender(req.params.gender);
            if (!genderSection) {
                return res.status(404).json({ message: 'Gender section not found' });
            }
            res.status(200).json(genderSection);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching gender section', error: error.message });
        }
    }

    async createGenderSection(req, res) {
        try {
            const newGenderSection = await GenderSectionService.createGenderSection(req.body);
            res.status(201).json(newGenderSection);
        } catch (error) {
            res.status(500).json({ message: 'Error creating gender section', error: error.message });
        }
    }

    async updateGenderSection(req, res) {
        try {
            const updatedGenderSection = await GenderSectionService.updateGenderSection(req.params.id, req.body);
            if (!updatedGenderSection) {
                return res.status(404).json({ message: 'Gender section not found' });
            }
            res.status(200).json(updatedGenderSection);
        } catch (error) {
            res.status(500).json({ message: 'Error updating gender section', error: error.message });
        }
    }

    async deleteGenderSection(req, res) {
        try {
            const result = await GenderSectionService.deleteGenderSection(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Gender section not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting gender section', error: error.message });
        }
    }
}

module.exports = new GenderSectionController();
