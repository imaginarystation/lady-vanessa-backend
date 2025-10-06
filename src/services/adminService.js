const Admin = require('../models/Admin');

class AdminService {
    // Get all admins
    async getAllAdmins() {
        try {
            const admins = await Admin.findAll({
                attributes: { exclude: ['password'] } // Don't return passwords
            });
            return admins;
        } catch (error) {
            throw new Error('Error fetching admins: ' + error.message);
        }
    }

    // Get admin by ID
    async getAdminById(adminId) {
        try {
            const admin = await Admin.findByPk(adminId, {
                attributes: { exclude: ['password'] }
            });
            if (!admin) {
                throw new Error('Admin not found');
            }
            return admin;
        } catch (error) {
            throw new Error('Error fetching admin: ' + error.message);
        }
    }

    // Get admin by email (for login)
    async getAdminByEmail(email) {
        try {
            const admin = await Admin.findOne({ where: { email } });
            return admin;
        } catch (error) {
            throw new Error('Error fetching admin: ' + error.message);
        }
    }

    // Create a new admin
    async createAdmin(data) {
        try {
            const admin = await Admin.create(data);
            // Return admin without password
            const adminData = admin.toJSON();
            delete adminData.password;
            return adminData;
        } catch (error) {
            throw new Error('Error creating admin: ' + error.message);
        }
    }

    // Update an admin
    async updateAdmin(adminId, data) {
        try {
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }
            await admin.update(data);
            const adminData = admin.toJSON();
            delete adminData.password;
            return adminData;
        } catch (error) {
            throw new Error('Error updating admin: ' + error.message);
        }
    }

    // Delete an admin
    async deleteAdmin(adminId) {
        try {
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }
            await admin.destroy();
            return { message: 'Admin deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting admin: ' + error.message);
        }
    }
}

module.exports = new AdminService();
