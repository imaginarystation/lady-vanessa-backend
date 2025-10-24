const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    receiveEmails: { type: DataTypes.BOOLEAN, defaultValue: false },
    profilePic: { type: DataTypes.STRING, allowNull: true },
    memberSince: { type: DataTypes.DATEONLY, allowNull: false },
    preferences: { type: DataTypes.TEXT, allowNull: true }, // Store as JSON string
}, {
    timestamps: true,
});

module.exports = User;