const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Import morgan
const fs = require('fs'); // Import fs to handle file system
const path = require('path'); // Import path to handle file paths
const { Sequelize } = require('sequelize');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config/config.js')['dbConnection'];
const { formatResponse } = require('./app/Helpers/helper'); // Import the helper function
const { toTitleCase } = require('./app/Helpers/utils'); // Import the title case utility
const redis = require('redis');
const cache = require('express-redis-cache')({ client: redis.createClient() });
const logView = require('./logView'); // Import the log view module

const Address = require('./models/Address');
const Country = require('./models/Country');
const State = require('./models/State');
const City = require('./models/City');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Redis client setup
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Use morgan for logging requests to a file
app.use(morgan('combined', { stream: accessLogStream })); // Log to access.log file

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Address API',
            version: '1.0.0',
            description: 'API for managing addresses',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(cache.route()); // Use Redis cache for all routes

// Connect to PostgreSQL
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to PostgreSQL has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Middleware to restrict access to logs
const restrictAccess = (req, res, next) => {
    const allowedIPs = ['YOUR_IP_ADDRESS']; // Replace with your IP address
    const clientIP = req.ip;

    if (allowedIPs.includes(clientIP)) {
        next(); // Allow access
    } else {
        res.status(403).send('Access denied');
    }
};

// API Endpoints
/**
 * @swagger
 * /api/v1/countries:
 *   get:
 *     summary: Retrieve a list of countries
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/v1/countries', cache.route(), async (req, res) => {
    try {
        const countries = await Country.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.json(formatResponse(countries, 'Countries retrieved successfully'));
    } catch (error) {
        res.status(500).json(formatResponse(null, error.message, 500));
    }
});

/**
 * @swagger
 * /api/v1/states/{country}:
 *   get:
 *     summary: Retrieve a list of states for a given country
 *     parameters:
 *       - name: country
 *         in: path
 *         required: true
 *         description: The name of the country
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of states for the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       CountryId:
 *                         type: integer
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       404:
 *         description: Country not found
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/v1/states/:country', cache.route(), async (req, res) => {
    try {
        const countryName = toTitleCase(req.params.country); // Convert to title case

        // Find the country and include its states using LIKE
        const country = await Country.findOne({
            where: { name: { [Sequelize.Op.iLike]: `%${countryName}%` } }, // Use iLike for case-insensitive matching
            include: {
                model: State,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        });

        if (!country) return res.status(404).json(formatResponse(null, 'Country not found', 404));
        res.json(formatResponse(country.States, 'States retrieved successfully'));
    } catch (error) {
        res.status(500).json(formatResponse(null, error.message, 500));
    }
});

/**
 * @swagger
 * /api/v1/cities/{country}/{state}:
 *   get:
 *     summary: Retrieve a list of cities for a given state in a given country
 *     parameters:
 *       - name: country
 *         in: path
 *         required: true
 *         description: The name of the country
 *         schema:
 *           type: string
 *       - name: state
 *         in: path
 *         required: true
 *         description: The name of the state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of cities for the specified state in the specified country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       404:
 *         description: State not found in the country
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/v1/cities/:country/:state', cache.route(), async (req, res) => {
    try {
        const countryName = toTitleCase(req.params.country); // Convert to title case
        const stateName = toTitleCase(req.params.state); // Convert to title case

        // Find the state and include its cities using LIKE
        const state = await State.findOne({
            where: { name: { [Sequelize.Op.like]: `%${stateName}%` } }, // Use LIKE with wildcards
            include: {
                model: Country,
                where: { name: { [Sequelize.Op.like]: `%${countryName}%` } }, // Use LIKE with wildcards
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        });

        if (!state) return res.status(404).json(formatResponse(null, 'State not found in the country', 404));

        const cities = await City.findAll({
            where: { StateId: state.id },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        res.json(formatResponse(cities, 'Cities retrieved successfully'));
    } catch (error) {
        res.status(500).json(formatResponse(null, error.message, 500));
    }
});

/**
 * @swagger
 * /api/v1/location/{pincode}:
 *   get:
 *     summary: Retrieve location details by pincode
 *     parameters:
 *       - name: pincode
 *         in: path
 *         required: true
 *         description: The pincode to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location details for the specified pincode
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     StateName:
 *                       type: string
 *                     CountryName:
 *                       type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       404:
 *         description: Location not found
 *       500:
 *         description: Internal Server Error
 */
app.get('/api/v1/location/:pincode', cache.route(), async (req, res) => {
    try {
        const pincode = req.params.pincode;

        // Find the city and include its state and country using LIKE
        const city = await City.findOne({
            where: { pincode: { [Sequelize.Op.like]: `%${pincode}%` } }, // Use LIKE with wildcards
            include: [
                {
                    model: State,
                    attributes: ['name', 'CountryId'],
                    include: {
                        model: Country,
                        attributes: ['name']
                    }
                }
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (!city) return res.status(404).json(formatResponse(null, 'Location not found', 404));
        res.json(formatResponse(city, 'Location retrieved successfully'));
    } catch (error) {
        res.status(500).json(formatResponse(null, error.message, 500));
    }
});

// Route to view access logs
app.get('/logs', restrictAccess, logView.getLogContents);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});