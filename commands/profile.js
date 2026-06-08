const get = require('../functions/fetch');
const components = require('../components/export');

async function profile(interaction) {
    await interaction.deferReply();

    const username = interaction.options.getString('username');

    const information = await get(`https://api.scratch.mit.edu/users/${username}`);

    if (information) {
        return interaction.editReply(components.profile(information));
    } else {
        return interaction.editReply(components.container(
            "Error while fetching user information",
            16756224
        ));
    }
}

module.exports = profile;