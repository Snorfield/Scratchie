const { ChannelType } = require('discord.js');
const components = require('../components/export');
const channels = require('../data/channels.json');

/**
 * Handle new help thread posts
 * @param {object} thread 
 * @param {boolean} created 
 */

async function helpGreet(thread, created) {
    if (!created) return;

    if (thread.parent?.type !== ChannelType.GuildForum) return;
    if (thread.parentId !== channels['help-channel']) return;

    const top = await thread.fetchStarterMessage().catch(() => null);
    const mention = top ? `<@${top.author.id}>` : 'there';

    await thread.send(components.container(
        `Hey ${mention}, help is on the way! Thanks for trusting Scratch Community to help with your project! Please note that it may take a few moments, people aren't always online. In the mean time, please explain your issue in detail!`,
        16756224
    )).catch(() => {});
}

module.exports = [
    helpGreet
]