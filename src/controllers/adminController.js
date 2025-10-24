const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminService = require('../services/adminService');

class AdminController {
    // Admin login
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const admin = await AdminService.getAdminByEmail(email);
            if (!admin) {
                return res.status(404).json({ error: 'Admin not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const token = jwt.sign(
                { id: admin.id, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            res.status(200).json({ 
                message: 'Login successful', 
                token,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    }

    // Register a new admin
    async register(req, res) {
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = await AdminService.createAdmin({
                name,
                email,
                password: hashedPassword
            });
            res.status(201).json({ 
                message: 'Admin registered successfully', 
                admin 
            });
        } catch (error) {
            res.status(500).json({ error: 'Error registering admin: ' + error.message });
        }
    }

    // Get all admins
    async getAllAdmins(req, res) {
        try {
            const admins = await AdminService.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching admins', error });
        }
    }

    // Get admin by ID
    async getAdminById(req, res) {
        try {
            const admin = await AdminService.getAdminById(req.params.id);
            res.status(200).json(admin);
        } catch (error) {
            res.status(404).json({ message: 'Admin not found', error });
        }
    }

    // Update an admin
    async updateAdmin(req, res) {
        try {
            const { password, ...updateData } = req.body;
            
            // Hash password if it's being updated
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }
            
            const updatedAdmin = await AdminService.updateAdmin(req.params.id, updateData);
            res.status(200).json(updatedAdmin);
        } catch (error) {
            res.status(500).json({ message: 'Error updating admin', error });
        }
    }

    // Delete an admin
    async deleteAdmin(req, res) {
        try {
            const result = await AdminService.deleteAdmin(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting admin', error });
        }
        // Handle users
    }
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await AdminService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    // Get user by ID
    async getUserById(req, res) {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const user = await AdminService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    }

    // Update a user
    async updateUser(req, res) {
        const { userId } = req.params;
        const data = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const updatedUser = await AdminService.updateUser(userId, data);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }

    // Delete a user
    async deleteUser(req, res) {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const deleteResult = await AdminService.deleteUser(userId);
            res.status(200).json(deleteResult);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}


module.exports = new AdminController();
