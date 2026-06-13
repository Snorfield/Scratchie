const {
    TextDisplayBuilder,
    ThumbnailBuilder,
    SectionBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    MessageFlags
} = require('discord.js');
const escape = require('../functions/escape');

/**
 * Build component with user information
 * @param {object} information
 * @returns {object}
 */

function profile(information) {
    const rawDate = `${information.history.joined}`;
    const date = new Date(rawDate);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let body = new TextDisplayBuilder().setContent(`# ${escape(information.username)}${information.scratchteam ? '*' : ''}`);

    if (information.profile.bio.length > 0) {
        body.push(
            new TextDisplayBuilder().setContent(`*${information.id} · ${formattedDate} · ${information.profile.country}*\n### About me\n${escape(information.profile.bio)}`)
        );
    }

    if (information.profile.status.length > 0) {
        body.push(
            new TextDisplayBuilder().setContent(`### What I'm working on\n${escape(information.profile.status)}`)
        );
    }
    return {
        components: [
            new ContainerBuilder()
            .setAccentColor(16756224)
            .addSectionComponents(
                new SectionBuilder()
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                    .setURL(information.profile.images['60x60'])
                )
                .addTextDisplayComponents(body)
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Profile")
                    .setEmoji({
                        name: "😺",
                    })
                    .setURL(`https://scratch.mit.edu/users/${information.username}/`)
                )
            )
        ],
        flags: MessageFlags.IsComponentsV2
    }
}

module.exports = profile;
