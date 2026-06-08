/**
 * Escape discord markdown
 * @param {string} text 
 * @returns {string}
 */

function escape(text) {
  return text
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/\|/g, '\\|')
    .replace(/#/g, '\\#');
}

module.exports = escape;
