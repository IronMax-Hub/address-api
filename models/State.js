const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')['dbConnection']; // Adjust for the environment as needed

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

const State = sequelize.define('State', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    CountryId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Countries', // This should match the table name in the database
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'States', // Optional: specify the table name if different
    timestamps: false, // Disable createdAt and updatedAt fields
});

// Sync the model with the database (optional, usually done in a separate migration)
sequelize.sync()
    .then(() => console.log('State table created!'));

module.exports = State;

// Define the relationship after the model is exported
const City = require('./City'); // Import City model here
State.hasMany(City, { foreignKey: 'StateId' }); 