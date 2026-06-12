const { TextDisplayBuilder, MessageFlags } = require('discord.js');
const get = require('../functions/fetch');
const components = require('../components/export');
const commandsData = require('../data/commands.json');

async function commands(interaction) {
    await interaction.deferReply();

    let body = '# Commands\n';
    const keys = Object.keys(commandsData);
    
    for (let i = 0; i < keys.length; i++) {
        const data = commandsData[keys[i]];
        body += `### ${data.name}\n${data.description}\n-# Params: ${data.params}\n-# Credits: ${data.credits}`;
        if (!(i === keys.length - 1)) {
            body += '\n';
        }
    }

    if (body) {
        const bodyComponents = [
            new TextDisplayBuilder().setContent(body)
        ];

         new ContainerBuilder()
            .setAccentColor(16756224)
        return interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } else {
        return interaction.editReply(components.container(
            "Error while fetching command information!",
            16756224
        ));
    }
}

module.exports = commands;
