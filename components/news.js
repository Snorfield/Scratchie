const escape = require('../functions/escape');
const truncate = require('../functions/truncate');

/**
 * Build component with news information
 * @param {object} information 
 * @returns {object}
 */

function news(information) {
    return {
        components: [
            {
                type: 17,
                accent_color: 16756224,
                spoiler: false,
                components: [
                    {
                        type: 9,
                        components: [
                            {
                                type: 10,
                                content: `${escape(truncate(information.news, 300))}`
                            },
                        ],
                        accessory: {
                            type: 11,
                            media: {
                                url: information.image
                            }
                        },
                    },
                ]
            }
        ],
        flags: 32768
    }
}

module.exports = news;
