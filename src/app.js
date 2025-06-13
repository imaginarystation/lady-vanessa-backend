const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Test route is working!' });
});
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

module.exports = app;