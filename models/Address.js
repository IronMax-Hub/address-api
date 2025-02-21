const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js')['dbConnection']; // Adjust for the environment as needed

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

const Country = require('./Country');
const State = require('./State');
const City = require('./City');

// Define relationships
Country.hasMany(State);
State.belongsTo(Country);
State.hasMany(City);
City.belongsTo(State);

// Sync the models with the database (optional, usually done in a separate migration)
sequelize.sync()
    .then(() => console.log('Database & tables created!'));

module.exports = { Country, State, City }; 