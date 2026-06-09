const get = require('../functions/fetch');
const components = require('../components/export');

async function explore(interaction) {
    await interaction.deferReply();

    const information = await get('https://raw.githubusercontent.com/scratchexplore/backend/refs/heads/main/data/trending.json');

    if (information && Array.isArray(information)) {

        const projects = information.slice(0, 4);

        const container = {
            type: 17,
            accent_color: 16756224,
            spoiler: false,
            components: []
        };

        for (const project of projects) {
            container.components.push(
                {
                    type: 9,
                    accessory: {
                        type: 11,
                        media: {
                            url: project.banner
                        },
                        description: null,
                        spoiler: false
                    },
                    components: [
                        {
                            type: 10,
                            content: `### ${project.title}\n-# By [${project.username}](https://scratch.mit.edu/users/${project.username})`
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            url: `https://scratch.mit.edu/projects/${project.id}`,
                            label: "Open",
                            disabled: false
                        }
                    ]
                },
                {
                    type: 14
                }
            );
        }

        // Remove trailing separator
        if (container.components.at(-1)?.type === 14) {
            container.components.pop();
        }

        return interaction.editReply({
            components: [container],
            flags: 32768
        });
    } else {
        return interaction.editReply(components.container(
            "Error while fetching explore information",
            16756224
        ));
    }
}

module.exports = explore;