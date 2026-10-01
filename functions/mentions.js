/**
 * Format scratch mentions as links on discord
 * @param {string} text 
 * @returns {string}
 */

// Hacky work-around to match escaped _ chars.

function formatMentions(text) {
    return text.replace(/@([a-zA-Z0-9_\\-]+)/g, (match, mention) => {
        const url = `https://scratch.mit.edu/users/${mention}`;
        return `[\`@${mention}\`](${url})`.replaceAll(/\\/g, '');
    })
}

module.exports = formatMentions;
