/**
 * Convert a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} - The converted title case string.
 */
function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

module.exports = {
    toTitleCase,
}; 