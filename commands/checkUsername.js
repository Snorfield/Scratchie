const {
    ContainerBuilder,
    TextDisplayBuilder,
    MessageFlags,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const get = require('../functions/fetch');
const components = require('../components/export');

async function checkusername(interaction) {
    await interaction.deferReply();

    const username = interaction.options.getString('username');
    const information = await get(`https://api.scratch.mit.edu/accounts/checkusername/${username}`);

    let status;
    let claimable;
    let body;

    if (information.msg === "valid username") {
        status = "not taken yet";
        claimable = true;
    } else if (information.msg === "invalid username") {
        status = "too short or too long";
        claimable = false;
    } else if (information.msg === "username exists") {
        status = "already taken";
        claimable = false;
    } else if (information.msg === "bad username") {
        status = "inappropriate";
        claimable = false;
    }

    if (username === "griffpatch") {
    body = `### Of course ${information.username} is taken silly!`
    } else {
    body = `### The username ${information.username} is ${status}.`;
    }
    
    let container;

    if (body) {
        if (claimable) {
            container = new ContainerBuilder()
                .setAccentColor(5763719)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(body)
                );

            container.addActionRowComponents(
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Claim Now")
                        .setEmoji({ 
                           name: "🎯" 
                         })
                        .setURL(`https://scratch.mit.edu/join/`)
                )
            );
        } else {
            container = new ContainerBuilder()
                .setAccentColor(15548997) 
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(body)
                );

            if (status === "already taken" && !claimable) {
                container.addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel("View Profile")
                            .setEmoji({ name: "😺" })
                            .setURL(`https://scratch.mit.edu/users/${username}/`)
                    )
                );
            }
        }

        return interaction.editReply({
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });

    } else {
        return interaction.editReply(components.container(
            "Error while fetching username information!",
            16756224
        ));
    }
}

module.exports = checkusername;
