const events = require('../data/events.json');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startGooseLore(channel) {
    let timeline = 0;
    while (timeline < events.length) {
        const wait = (30 + Math.floor(Math.random() * 21)) * 60 * 1000;
        await sleep(wait);

        const event = events[timeline];

        await runEvent(channel, event);
        timeline++;
    }
}

async function runEvent(channel, event) {
    for (const message of event) {

        await channel.sendTyping();

        const typing =
            1000 + Math.random() * 4000; 

        await sleep(typing);

        await channel.send(message.content);

        if (message.time) {
            await sleep(Number(message.time));
        }
    }
}

module.exports = startGooseLore;