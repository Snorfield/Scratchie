const escape = require('../functions/escape');
const truncate = require('../functions/truncate');

/**
 * Build component with studio information
 * @param {object} information 
 * @returns {object}
 */

function studio(information) {
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
                                content: `# ${escape(information.title)}`
                            },
                            ...((information.description.length > 0) ? [{
                                type: 10,
                                content: `${escape(truncate(information.description, 300))}`
                            }] : []),
                        ],
                        accessory: {
                            type: 11,
                            media: {
                                url: information.image
                            }
                        },
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 5,
                                "url": `https://scratch.mit.edu/studios/${information.id}/`,
                                "label": "Studio",
                                "emoji": null,
                                "disabled": false
                            }
                        ]
                    }
                ]
            }
        ],
        flags: 32768
    }
}

module.exports = studio;