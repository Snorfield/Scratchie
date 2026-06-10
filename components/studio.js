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

/**
 * Build component with studio information
 * @param {object} information 
 * @returns {object}
 */

function studio(information) {
    const body = [
        new TextDisplayBuilder().setContent(
            `-# ID: ${information.id} | ${information.stats.projects} projects | ${information.stats.followers} followers`
        ),
        new TextDisplayBuilder().setContent(
            `# ${escape(information.title)}`
        )
    ]

    if (information.description.length > 0) {
        body.push(
            new TextDisplayBuilder().setContent(
                `${escape(truncate(information.description, 300))}`
            )
        );
    } else {
        body.push(
            new TextDisplayBuilder().setContent(
                '*No studio description*'
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
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("Studio")
                                .setURL(`https://scratch.mit.edu/studios/${information.id}/`)
                        )
                )
        ],
        flags: MessageFlags.IsComponentsV2
    }
}

module.exports = studio;
