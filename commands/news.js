const get = require('../functions/fetch');
const components = require('../components/export');

async function studio(interaction) {
    await interaction.deferReply();

    const information = await get('https://api.scratch.mit.edu/news?limit=3');

    if (information) {
        return interaction.editReply(components.news(information));
    } else {
        return interaction.editReply(components.container(
            "Error while fetching news information",
            16756224
        ));
    }
}

module.exports = news;
