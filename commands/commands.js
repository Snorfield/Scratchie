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
        commandCredits: `${pings.rosics} & ${pings.snorfield}`
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
      },
      ping: {
        commandName: "/ping",
        commandDescription: "Check slash commands.",
        commandParams: "None",
        commandCredits: `${pings.snorfield}`
      }
    };
    


let string = '# Commands\n';
const keys = Object.keys(commands);
for (let i = 0; i < keys.length; i++)
  const data = commands[keys[i]];
  string += `### ${data.commandName}\n${data.commandDescription}\n-# Params: ${data.commandParams}\n-# Credits: ${data.commandCredits}`
  if (!(i === keys.length - 1)) {
    string += '\n'
  }
}

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
                            content: string
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
