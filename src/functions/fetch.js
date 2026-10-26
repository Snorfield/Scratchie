/**
 * Wrapper for fetch api
 * @param {string} url 
 * @returns {string}
 */

async function get(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }
        const json = await response.json();
        return json;
    } catch (error) {
        return null;
    }
}

module.exports = get;