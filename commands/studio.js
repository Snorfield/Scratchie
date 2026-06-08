const get = require('../functions/fetch');
const components = require('../components/export');

async function studio(interaction) {
    await interaction.deferReply();

    const id = interaction.options.getNumber('id');

    const information = await get(`https://api.scratch.mit.edu/studios/${id}`);

    if (information) {
        return interaction.editReply(components.studio(information));
    } else {
        return interaction.editReply(components.container(
            "Error while fetching studio information",
            16756224
        ));
    }
}

module.exports = studio;