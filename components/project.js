const escape = require('../functions/escape');

/**
 * Build component with project information
 * @param {object} information 
 * @returns {object}
 */

function project(information) {
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
                            ...((information.instructions.length > 0) ? [{
                                type: 10,
                                content: `### Instructions\n${escape(information.instructions)}`
                            }] : []),
                            ...((information.description.length > 0) ? [{
                                type: 10,
                                content: `### Notes and Credits\n${escape(information.description)}`
                            }] : [])
                        ],
                        accessory: {
                            type: 11,
                            media: {
                                url: information.image
                            }
                        },
                    },
                    {
                        type: 10,
                        content: `**<:views:1513564664527847444> ${information.stats.views}**\n**<:love:1513564630394601472> ${information.stats.loves}**\n**<:favorite:1513564542523805868> ${information.stats.favorites}**\n**<:remix:1513564587960569958> ${information.stats.remixes}**`
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 5,
                                "url": `https://scratch.mit.edu/projects/${information.id}/`,
                                "label": "Project",
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

module.exports = project;
