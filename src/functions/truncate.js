/**
 * Truncate text to a max length
 * @param {string} text 
 * @param {integer} max 
 * @returns {string}
 */

function truncate(text, max) {
    if (text.length > max) {
        return text.slice(0, max) + "...";
    } else {
        return text;
    }
}

module.exports = truncate;