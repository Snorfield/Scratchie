/**
 * Build simple component with color and content
 * @param {string} text 
 * @param {number} color 
 * @returns {object}
 */

function container(text, color) {
    return {
        components: [
            {
                type: 17,
                accent_color: color,
                spoiler: false,
                components: [
                    {
                        type: 10,
                        content: text
                    }
                ]
            }
        ],
        flags: 32768
    }
}

module.exports = container;