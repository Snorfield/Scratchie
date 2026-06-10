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
const truncate = require('../functions/truncate');
const emojis = require('../data/emojis.json');

/**
 * Build component with project information
 * @param {object} information 
 * @returns {object}
 */

function project(information) {
    const body = [
        new TextDisplayBuilder().setContent(
            `# ${escape(information.title)}\n-# By [${information.author.username}](https://scratch.mit.edu/users/${information.author.username})\n`
        )
    ]

    if (information.instructions.length > 0) {
        body.push(
            new TextDisplayBuilder().setContent(
                `### Instructions\n${escape(truncate(information.instructions, 300))}`
            )
        );
    }

    if (information.description.length > 0) {
        body.push(
            new TextDisplayBuilder().setContent(
                `### Notes and Credits\n${escape(truncate(information.description, 300))}`
            )
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
                                .setURL(information.image)
                        )
                        .addTextDisplayComponents(body)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `**${emojis.view} ${information.stats.views} ${emojis.remix} ${information.stats.remixes} ${emojis.love} ${information.stats.loves} ${emojis.favorite} ${information.stats.favorites}**`
                    )
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("Scratch")
                                .setEmoji({
                                    name: "😺",
                                })
                                .setURL(`https://scratch.mit.edu/projects/${information.id}/`),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("TurboWarp")
                                .setEmoji({
                                    name: "🍡",
                                })
                                .setURL(`https://turbowarp.org/${information.id}/`),
                        )
                )
        ],
        flags: MessageFlags.IsComponentsV2
    }
}

module.exports = project;
