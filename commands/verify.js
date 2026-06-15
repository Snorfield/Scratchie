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
const crypto = require('crypto');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function verify(interaction) {
    await interaction.deferReply();

    const username = interaction.user.username;
    const hashedUnique = username + Date.now();
    const hashedUsername = crypto
        .createHash('md5')
        .update(hashedUnique)
        .digest('hex');

    let verified = false;
    let container;
    const member = interaction.member;
    const roleId = '1516147609297883186';
    const oldRoleId = '1516147404603134192';

    container = new ContainerBuilder()
        .setAccentColor(15548997) 
        .addTextDisplayComponents( 
            new TextDisplayBuilder().setContent(`# Verify\n**Verify your account on the project with this string: \`${hashedUsername}\`**`)
        )
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Project")
                        .setEmoji({ name: "😺" })
                        .setURL(`https://scratch.mit.edu/projects/1332105577`)
                )
        );

    await interaction.editReply({
        components: [container.toJSON()],
        flags: MessageFlags.IsComponentsV2
    });

    while (!verified) {
        try {
            const comments = await get(`https://api.scratch.mit.edu/users/ScratchieVerify/projects/1332105577/comments`);
            if (Array.isArray(comments)) {
                const foundComment = comments.find(c => c.content && c.content.includes(hashedUsername));
                if (foundComment) {
                    verified = true;
                    member.roles.add(roleId);
                    member.roles.remove(oldRoleId);
                    break;
                }
            }
        } catch (error) {
          container = new ContainerBuilder()
            .setAccentColor(15548997) 
          .addTextDisplayComponents( 
            new TextDisplayBuilder().setContent(`# Verify\n**The Scratch API may be down or there was another error**.`)
          )
        }
        await wait(5000);
    }
        
    if (verified) {
        container = new ContainerBuilder()
            .setAccentColor(5763719) 
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# Verify\n**Success! Verification complete for ${username}. Gave verified role!**`)
            );

        return interaction.editReply({
            components: [container.toJSON()],
            flags: MessageFlags.IsComponentsV2
        });

    } else {
        return interaction.editReply({
            components: [components.container("Error while fetching verify information!", 16756224).toJSON()],
            flags: MessageFlags.IsComponentsV2
        });
    }
}

module.exports = verify;
