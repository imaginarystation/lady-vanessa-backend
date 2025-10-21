const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Event = sequelize.define('Event', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    heroImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    aboutDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    collectionHighlights: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    btsImages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    eventDetails: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    eventBackgroundImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ticketCtaLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    galleryCtaLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactCtaLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
});

module.exports = Event;
