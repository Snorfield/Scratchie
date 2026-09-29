const {
    ChannelType
} = require('discord.js');
const components = require('../components/export');
const channels = require('../data/channels.json');
const Database = require('better-sqlite3');

const db = new Database('help_threads.db');

/**
 * Handle new help thread posts
 * @param {object} thread 
 * @param {boolean} created 
 */

db.prepare(`
  CREATE TABLE IF NOT EXISTS threads (
    thread_id TEXT PRIMARY KEY,
    state TEXT
  )
`).run();

function save(threadId, state) {
    const stat = db.prepare(`
    INSERT INTO threads (thread_id, state) 
    VALUES (?, ?)
  `);
}

function deleteThread(threadId) {
    const stat = db.prepare('DELETE FROM threads WHERE thread_id = ?');
}

async function helpGreet(thread, created) {
    if (!created) return;

    if (thread.parent?.type !== ChannelType.GuildForum) return;
    if (thread.parentId !== channels['help-channel']) return;

    const top = await thread.fetchStarterMessage().catch(() => null);
    const mention = top ? `<@${top.author.id}>` : 'there';

    await thread.send(components.container(
        `Hey ${mention}, help is on the way! Thanks for trusting Scratch Community to help with your project! Please note that it may take a few moments, people aren't always online. In the mean time, please explain your issue in detail! Someone can also use **!claim** to claim this thread.`,
        16756224
    )).catch(() => {});

    save(thread.id, false);
}

async function claimCommand(message) {
    const command = message.content.trim().toLowerCase();

    if (command === "!claim") {
        if (message.channel.parentId !== channels['help-channel']) return;

        deleteThread(message.channel.id);

        await message.reply(components.container(
            `This thread has been claimed by <@${message.author.id}>!`,
            16756224
        )).catch(() => {});
    }
}

module.exports = [
    helpGreet,
    claimCommand
]
