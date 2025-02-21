const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')['dbConnection']; // Adjust for the environment as needed

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

const City = sequelize.define('City', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    StateId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'States', // This should match the table name in the database
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    lat: {
        type: DataTypes.FLOAT,
    },
    lng: {
        type: DataTypes.FLOAT,
    },
}, {
    tableName: 'Cities', // Optional: specify the table name if different
    timestamps: false, // Disable createdAt and updatedAt fields
});

// Sync the model with the database (optional, usually done in a separate migration)
sequelize.sync()
    .then(() => console.log('City table created!'));

module.exports = City; 