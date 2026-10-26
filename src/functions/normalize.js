/**
 * Normalize text and remove non-letters and non-digits
 * @param {string} text 
 * @returns {string}
 */

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

module.exports = normalize;