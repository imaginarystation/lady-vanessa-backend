const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminService = require('../services/adminService');
const ProductService = require('../services/productService');
const OrderService = require('../services/orderService');
const UserService = require('../services/userService');

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
    }

    // Admin Product Management
    async getProducts(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;
            const filters = {
                category: req.query.category,
                gender: req.query.gender,
                status: req.query.status,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
            };
            const result = await ProductService.getAllProductsPaginated(page, limit, filters);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await ProductService.createProduct(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error creating product', error });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error updating product', error });
        }
    }

    async deleteProduct(req, res) {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product', error });
        }
    }

    // Admin Order Management
    async getOrders(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;
            const result = await OrderService.getAllOrdersPaginated(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching orders', error });
        }
    }

    async updateOrder(req, res) {
        try {
            const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error });
        }
    }

    // Admin User Management
    async getUsers(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 20;
            const result = await UserService.getAllUsers(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: 'User not found', error });
        }
    }

    async createUser(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.id, req.body);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await UserService.deleteUser(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}

module.exports = new AdminController();
