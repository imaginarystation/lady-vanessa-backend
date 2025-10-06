// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DB_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';

// Mock the database configuration to prevent actual database connection
jest.mock('../src/config/dbConfig', () => {
    const { Sequelize } = require('sequelize');
    const sequelize = new Sequelize('sqlite::memory:', {
        logging: false,
        sync: { force: true }
    });
    return sequelize;
});
