const PerfumeService = require('../services/perfumeService');

class PerfumeController {
    async getAllPerfumes(req, res) {
        try {
            const filters = {
                sectionTag: req.query.sectionTag,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
            };
            const perfumes = await PerfumeService.getAllPerfumes(filters);
            res.status(200).json(perfumes);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching perfumes', error: error.message });
        }
    }

    async getPerfumeById(req, res) {
        try {
            const perfume = await PerfumeService.getPerfumeById(req.params.id);
            if (!perfume) {
                return res.status(404).json({ message: 'Perfume not found' });
            }
            res.status(200).json(perfume);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching perfume', error: error.message });
        }
    }

    async searchPerfumes(req, res) {
        try {
            const query = req.query.q || '';
            const perfumes = await PerfumeService.searchPerfumes(query);
            res.status(200).json(perfumes);
        } catch (error) {
            res.status(500).json({ message: 'Error searching perfumes', error: error.message });
        }
    }

    async createPerfume(req, res) {
        try {
            const newPerfume = await PerfumeService.createPerfume(req.body);
            res.status(201).json(newPerfume);
        } catch (error) {
            res.status(500).json({ message: 'Error creating perfume', error: error.message });
        }
    }

    async updatePerfume(req, res) {
        try {
            const updatedPerfume = await PerfumeService.updatePerfume(req.params.id, req.body);
            if (!updatedPerfume) {
                return res.status(404).json({ message: 'Perfume not found' });
            }
            res.status(200).json(updatedPerfume);
        } catch (error) {
            res.status(500).json({ message: 'Error updating perfume', error: error.message });
        }
    }

    async deletePerfume(req, res) {
        try {
            const result = await PerfumeService.deletePerfume(req.params.id);
            if (!result) {
                return res.status(404).json({ message: 'Perfume not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting perfume', error: error.message });
        }
    }
}

module.exports = new PerfumeController();
