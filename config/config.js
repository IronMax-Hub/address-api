require('dotenv').config(); // Load environment variables from .env file

module.exports = {
    dbConnection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'postgres',
    },
    // Add other environments (test, production) as needed
}; 