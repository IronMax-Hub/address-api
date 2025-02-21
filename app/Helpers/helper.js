/**
 * Helper function to format API responses
 * @param {Object} data - The data to be returned in the response
 * @param {string} message - A message to include in the response
 * @param {number} status - The HTTP status code
 * @returns {Object} - The formatted response object
 */
function formatResponse(data, message = '', status = 200) {
    return {
        data: data,
        message: message,
        status: status,
    };
}

module.exports = {
    formatResponse,
}; 