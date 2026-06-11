const { TextDisplayBuilder, MessageFlags } = require('discord.js');
const get = require('../functions/fetch');
const components = require('../components/export');

async function commands(interaction) {
    await interaction.deferReply();

    const commands = {
      commands: {
        name: "/commands",
        description: "View all commands.",
        params: "None",
        credits: "Rosics"
      },
      explore: {
        name: "/explore",
        description: "Explore new quality Scratch projects.",
        params: "None",
        credits: "Snorfield"
      },
      news: {
        name: "/news",
        description: "View new Scratch news articles.",
        params: "None",
        credits: "Rosics & Snorfield"
      },
      project: {
        name: "/project",
        description: "View Scratch project information.",
        params: "Project ID",
        credits: "Snorfield & Joshisaurio"
      },
      studio: {
        name: "/studio",
        description: "View Scratch studio information.",
        params: "Studio ID",
       credits: "Snorfield"
      },
      profile: {
        name: "/profile",
        description: "View Scratch user profile information.",
        params: "Username",
        credits: "Snorfield"
      },
      ping: {
        name: "/ping",
        description: "Check slash commands.",
        params: "None",
        credits: "Snorfield"
      }
    };
    
    let body = '# Commands\n';
    const keys = Object.keys(commands);
    for (let i = 0; i < keys.length; i++) {
        const data = commands[keys[i]];
        body += `### ${data.name}\n${data.description}\n-# Params: ${data.params}\n-# Credits: ${data.credits}`;
        if (!(i === keys.length - 1)) {
            body += '\n';
        }
    }

    if (body) {
        const bodyComponents = [
            new TextDisplayBuilder().setContent(body)
        ];
        const container = {
            type: 17,
            accent_color: 16756224,
            spoiler: false,
            components: bodyComponents
        };
        return interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } else {
        return interaction.editReply(components.container(
            "Error while fetching command information!",
            16756224
        ));
    }
}
module.exports = commands;
