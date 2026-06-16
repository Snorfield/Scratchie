const functionWords = new Set([
    'a', 'an', 'the',
    'is', 'are', 'was', 'were',
    'am', 'be', 'been',
    'do', 'does', 'did',
    'to', 'of', 'in', 'on', 'at',
    'for', 'with', 'and', 'or',
    'this', 'that', 'these', 'those',
    'it', 'its'
]);

/**
 * Sort a word array and remove function words
 * @param {array} array 
 *
 */

function semanticize(string) {
    return string
        .split(' ')
        .filter(word => !functionWords.has(word))
        .sort()
        .join(' ')
}

module.exports = semanticize;