const User = require('../models/User');

class UserService {
    // Get all users with pagination
    async getAllUsers(page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await User.findAndCountAll({
                attributes: { exclude: ['password'] },
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
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    }
}

module.exports = new UserService();
