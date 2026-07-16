/**
 * Send typing to the discord channel before sending
 * @param {object} message 
 */

async function type(message) {
    await message.channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 500 + Math.floor(Math.random() * 1500)));
}

module.exports = type;
