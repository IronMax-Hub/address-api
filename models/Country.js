const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')['dbConnection']; // Adjust for the environment as needed

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

const Country = sequelize.define('Country', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    short: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    common_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    iso3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    num_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Countries', // Optional: specify the table name if different
    timestamps: true, // Enable createdAt and updatedAt fields
});

// Sync the model with the database (optional, usually done in a separate migration)
sequelize.sync()
    .then(() => console.log('Country table created!'));

module.exports = Country;

// Define the relationship after the model is exported
const State = require('./State'); // Import State model here
Country.hasMany(State, { foreignKey: 'CountryId' }); 