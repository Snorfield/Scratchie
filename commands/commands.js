const get = require('../functions/fetch');
const components = require('../components/export');

async function commands(interaction) {
    await interaction.deferReply();

    const commands = {
      commands: {
        commandName: "/commands",
        commandDescription: "View all commands.",
        commandParams: "None",
        commandCredits: `Rosics`
      },
      explore: {
        commandName: "/explore",
        commandDescription: "Explore new quality Scratch projects.",
        commandParams: "None",
        commandCredits: `Snorfield`
      },
      news: {
        commandName: "/news",
        commandDescription: "View new Scratch news articles.",
        commandParams: "None",
        commandCredits: `Rosics & Snorfield`
      },
      project: {
        commandName: "/project",
        commandDescription: "View Scratch project information.",
        commandParams: "Project ID",
        commandCredits: `Snorfield`
      },
      studio: {
        commandName: "/studio",
        commandDescription: "View Scratch studio information.",
        commandParams: "Studio ID",
        commandCredits: `Snorfield`
      },
      profile: {
        commandName: "/profile",
        commandDescription: "View Scratch user profile information.",
        commandParams: "Username",
        commandCredits: `Snorfield`
      },
      ping: {
        commandName: "/ping",
        commandDescription: "Check slash commands.",
        commandParams: "None",
        commandCredits: `Snorfield`
      }
    };
    
    let string = '# Commands\n';
    const keys = Object.keys(commands);
    for (let i = 0; i < keys.length; i++) {
        var data = commands[keys[i]];
        string += `### ${data.commandName}\n${data.commandDescription}\n-# Params: ${data.commandParams}\n-# Credits: ${data.commandCredits}`;
        if (!(i === keys.length - 1)) {
            string += '\n';
        }
    }

    if (string) {
        const container = {
            type: 17,
            accent_color: 16756224,
            spoiler: false,
            components: []
        };

          const body = [
        new TextDisplayBuilder().setContent(
            `{$string}`
        )
    ] 
    } else {
        return interaction.editReply(components.container(
            "Error while fetching command information!",
            16756224
}

module.exports = commands;
