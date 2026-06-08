const get = require('../functions/fetch');
const components = require('../components/export');

async function project(interaction) {
    await interaction.deferReply();

    const id = interaction.options.getNumber('id');

    const information = await get(`https://api.scratch.mit.edu/projects/${id}`);

    if (information) {
        return interaction.editReply(components.project(information));
    } else {
        return interaction.editReply(components.container(
            "Error while fetching project information",
            16756224
        ));
    }
}

module.exports = project;