const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'access.log');

const getLogContents = (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading log file');
        }
        res.send(`<pre>${data}</pre>`); // Display log contents in a preformatted text block
    });
};

module.exports = { getLogContents }; 