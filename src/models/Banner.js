const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Banner = sequelize.define('Banner', {
    mediaType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'image',
    },
    src: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    timestamps: true,
});

module.exports = Banner;
