const get = require('../functions/fetch');
const components = require('../components/export');
const pings = require('../data/pings.json');

async function commands(interaction) {
    await interaction.deferReply();

    const commands = {
      commands: {
        commandName: "/commands",
        commandDescription: "View all commands.",
        commandParams: "None",
        commandCredits: `${pings.rosics}`
      },
      explore: {
        commandName: "/explore",
        commandDescription: "Explore new quality Scratch projects.",
        commandParams: "None",
        commandCredits: `${pings.snorfield}`
      },
      news: {
        commandName: "/news",
        commandDescription: "View new Scratch news articles.",
        commandParams: "None",
        commandCredits: `${pings.rosics}`
      },
      project: {
        commandName: "/project",
        commandDescription: "View Scratch project information.",
        commandParams: "Project ID",
        commandCredits: `${pings.snorfield}`
      },
      studio: {
        commandName: "/studio",
        commandDescription: "View Scratch studio information.",
        commandParams: "Studio ID",
        commandCredits: `${pings.snorfield}`
      },
      profile: {
        commandName: "/profile",
        commandDescription: "View Scratch user profile information.",
        commandParams: "Username",
        commandCredits: `${pings.snorfield}`
      }
    };

    if (information) {

        const container = {
            type: 17,
            accent_color: 16756224,
            spoiler: false,
            components: []
        };

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
                            content: `# Commands\n### ${commands.commands.commandName}\n${commands.commands.commandDescription}\n-# ${commands.commands.commandParams}\n-# ${commands.commandCredits}\n### ${commands.explore.commandName}\n${commands.explore.commandDescription}\n-# ${commands.explore.commandParams}\n-# ${commands.explore.commandCredits}\n### ${commands.news.commandName}\n${commands.news.commandDescription}\n-# ${commands.news.commandParams}\n-# ${commands.news.commandCredits}\n### ${commands.project.commandName}\n${commands.project.commandDescription}\n-# ${commands.project.commandParams}\n-# ${commands.project.commandCredits}\n### ${commands.studio.commandName}\n${commands.studio.commandDescription}\n-# ${commands.studio.commandParams}\n-# ${commands.studio.commandCredits}\n### ${commands.profile.commandName}\n${commands.profile.commandDescription}\n-# ${commands.profile.commandParams}\n-# ${commands.profile.commandCredits}`
                        }
                    ]
                },
                {
                    type: 14
                }
            );
        
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

module.exports = commands;
