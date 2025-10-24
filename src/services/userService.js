const User = require('../models/User');
const bcrypt = require('bcrypt');

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

    // Create a new user
    async createUser(userData) {
        try {
            const { name, email, password } = userData;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });
            // Return user without password
            const { password: _, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Update a user
    async updateUser(userId, userData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // If password is being updated, hash it
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            await user.update(userData);
            
            // Return user without password
            const { password: _, ...userWithoutPassword } = user.toJSON();
            return userWithoutPassword;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    // Delete a user
    async deleteUser(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

module.exports = new UserService();
