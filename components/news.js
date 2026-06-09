const escape = require('../functions/escape');
const truncate = require('../functions/truncate');

/**
 * Build component with news information
 * @param {object} information 
 * @returns {object}
 */

function news(newsList) {
    const textComponents = newsList.map(function(item) {
        const formattedContent = `**${item.headline}**\n${item.copy}`;
        return {
            type: 10,
            content: escape(truncate(formattedContent.news, 300))
        };
    });
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
                                content: textComponents
                          },
                       ],
                     }
                  },
               },
            }
        ],
        flags: 32768
    }
}

module.exports = news;
