const escape = require('../functions/escape');

/**
 * Build component with user information
 * @param {object} information 
 * @returns {object}
 */

function profile(information) {
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
                                content: `# ${escape(information.username)}`
                            },
                            ...((information.profile.bio.length > 0) ? [{
                                type: 10,
                                content: `*${information.id} | ${information.profile.country}*\n### About me\n${escape(information.profile.bio)}`
                            }] : []),
                            ...((information.profile.status.length > 0) ? [{
                                type: 10,
                                content: `### What I'm working on\n${escape(information.profile.status)}`
                            }] : [])
                        ],
                        accessory: {
                            type: 11,
                            media: {
                                url: information.profile.images['60x60']
                            }
                        },
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 5,
                                "url": `https://scratch.mit.edu/users/${information.username}/`,
                                "label": "Profile",
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

module.exports = profile;