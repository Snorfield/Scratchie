const get = require('../functions/fetch');
const components = require('../components/export');

async function news(interaction) {
    await interaction.deferReply();

    const information = await get('https://api.scratch.mit.edu/news?limit=3');

    if (information) {

        const container = {
            type: 17,
            accent_color: 16756224,
            spoiler: false,
            components: []
        };

        for (const article of information) {
            container.components.push(
                {
                    type: 9,
                    accessory: {
                        type: 11,
                        media: {
                            url: article.image
                        },
                        description: null,
                        spoiler: false
                    },
                    components: [
                        {
                            type: 10,
                            content: `## ${article.headline}\n${article.copy}`
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            url: article.url,
                            label: "Article",
                            disabled: false
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 1,
                            style: 5,
                            url: "https://scratch.mit.edu/discuss/5",
                            label: "See All News",
                            disabled: false
                        }
                    ]
                },
                {
                    type: 14
                }
            );
        }

        if (container.components.at(-1)?.type === 14) {
            container.components.pop();
        }

        return interaction.editReply({
            components: [container],
            flags: 32768
        });
    } else {
        return interaction.editReply(components.container(
            "Error while fetching news information!",
            16756224
        ));
    }
}

module.exports = news;
