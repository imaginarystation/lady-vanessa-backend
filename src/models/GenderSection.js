const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const GenderSection = sequelize.define('GenderSection', {
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    headerTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    headerImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    eventsText: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    eventsLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    promoImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    promoText: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    promoLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    filters: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    sections: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
}, {
    timestamps: true,
});

module.exports = GenderSection;
