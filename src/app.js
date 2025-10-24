const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoute');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const perfumeRoutes = require('./routes/perfumeRoutes');
const genderSectionRoutes = require('./routes/genderSectionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working!' });
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderItemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/perfumes', perfumeRoutes);
app.use('/api/gender-sections', genderSectionRoutes);
app.use('/api/upload', uploadRoutes);

module.exports = app;