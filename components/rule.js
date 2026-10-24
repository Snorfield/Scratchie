/**
 * Build simple component with color and content
 * @param {string} text 
 * @param {number} color 
 * @returns {object}
 */

function container(title, content, url1, url2, is_subrule) {
    if (is_subrule) {
        return {
            components: [{
                "type": 17,
                "accent_color": 9225410,
                "spoiler": false,
                "components": [
                    {
                        "type": 10,
                        "content": `### ${title}\n-# *Expansion of Rule ${title.match(/(?<=\bRULE\s)(\w+)/)[1]}*`
                    },
                    {
                        "type": 14,
                        "divider": true,
                        "spacing": 1
                    },
                    {
                        "type": 10,
                        "content": content
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 5,
                                "label": "View rule",
                                "emoji": null,
                                "disabled": false,
                                "url": url2
                            },
                            {
                                "type": 2,
                                "style": 5,
                                "label": "View parent rule",
                                "emoji": null,
                                "disabled": false,
                                "url": url1
                            },
                        ]
                    }
                ]
            }],
            flags: 32768
        }
    } else {
        return {
            components: [{
                "type": 17,
                "accent_color": 9225410,
                "spoiler": false,
                "components": [
                    {
                        "type": 10,
                        "content": "### " + title
                    },
                    {
                        "type": 14,
                        "divider": true,
                        "spacing": 1
                    },
                    {
                        "type": 10,
                        "content": content
                    },
                    {
                        "type": 1,
                        "components": [
                            {
                                "type": 2,
                                "style": 5,
                                "label": "View full rule",
                                "emoji": null,
                                "disabled": false,
                                "url": url1
                            },
                            {
                                "type": 2,
                                "style": 5,
                                "label": "View rule expansion",
                                "emoji": null,
                                "disabled": false,
                                "url": url2
                            },
                        ]
                    }
                ]
            }],
        flags: 32768
        }
    }
}

module.exports = container;