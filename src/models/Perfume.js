const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Perfume = sequelize.define('Perfume', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sectionTag: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    filterTags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
}, {
    timestamps: true,
});

module.exports = Perfume;
