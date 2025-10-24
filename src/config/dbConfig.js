const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
// });
// Alternatively, you can use a single DATABASE_URL environment variable


const { DB_URL } = process.env;

const sequelize = new Sequelize(DB_URL, {
    url: DB_URL,
  dialect: 'postgres',
  define: {
    schema: 'public', // Specify the default schema here
  },
    // logging: false, // Disable logging; default: console.logr
});

module.exports = sequelize;