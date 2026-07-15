/**
 * Random value between 0 and the length of the array - 1
 * @param {integer} length 
 * @returns {integer}
 */

function randomArrayInt(length) {
    return Math.floor(Math.random() * length);
}

module.exports = randomArrayInt;
