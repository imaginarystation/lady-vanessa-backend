const app = require('./app');
const dotenv = require('dotenv');
const { User, Product, Order, OrderItem, Admin } = require('./models');

dotenv.config();

const PORT = process.env.PORT || 5000;

const sequelize = require('./config/dbConfig');

sequelize.sync({ force: true }) // Use `force: true` only for development
    .then(() => {
        console.log('Database synced successfully!');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});