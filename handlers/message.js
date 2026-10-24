const get = require('../functions/fetch');
const components = require('../components/export');
const channels = require('../data/channels.json');
const replies = require('../data/replies.json');
const { clientId } = require('../config.json');
const normalize = require('../functions/normalize');
const crypto = require('crypto');
const semanticize = require('../functions/semanticize');
const randomArrayInt = require('../functions/random');
const type = require('../functions/type.js');
const { PermissionFlagsBits } = require('discord.js');

const reactions = [
    { regex: /penguinmod/i, emoji: '🐧' },
    { regex: /nitrobolt/i, emoji: '⚡' },
    { regex: /turbowarp/i, emoji: '🍡' },
    { regex: /^(hi|hello|hiya|sup|hey)$/i, emoji: '1359604048801829114' },
    { regex: /\bgobo\b/i, emoji: '1465845363326976343' },
    { regex: /\bgiga\b/i, emoji: '1465845449524252703' },
    { regex: /\btera\b/i, emoji: '1465845334126100695' },
    { regex: /\bnano\b/i, emoji: '1465845395753271316' },
    { regex: /\bmilli\b/i, emoji: '1492169394040737982' },
    { regex: /\bpico\b/i, emoji: '1465845424421081259' },
    { regex: /\bzepto\b/i, emoji: '1492169432070619216' }
];

/**
 * Capture Scratch profile links and send a preview of them
 * @param {Message} message 
 */

async function linkProfile(message) {
    if (message.author.id === clientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel.parentId)) {
        const matches = (message.content).match(/scratch\.mit\.edu\/users\/([a-zA-Z0-9-_]+)/);
        if (matches) {
            const username = matches[1];

            const information = await get(`https://api.scratch.mit.edu/users/${username}`);

            if (information) {
                message.reply(components.profile(information));
            }
        }
    }
}

/**
 * Capture Scratch project links and send a preview of them
 * @param {Message} message 
 */

async function linkProject(message) {
    if (message.author.id === clientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel.parentId)) {
        const matches = (message.content).match(/scratch\.mit\.edu\/projects\/([0-9]+)/);
        if (matches) {
            const id = matches[1];

            const information = await get(`https://api.scratch.mit.edu/projects/${id}`);

            if (information) {
                message.reply(components.project(information));
            }
        }
    }
}

/**
 * Capture Scratch studio links and send a preview of them
 * @param {Message} message 
 */

async function linkStudio(message) {
    if (message.author.id === clientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel.parentId)) {
        const matches = (message.content).match(/scratch\.mit\.edu\/studios\/([0-9]+)/);
        if (matches) {
            const id = matches[1];

            const information = await get(`https://api.scratch.mit.edu/studios/${id}`);

            if (information) {
                message.reply(components.studio(information));
            }
        }
    }
}

/**
 * Capture Scratch profile and project links to warn the user not to advertise
 * @param {Message} message 
 */

function captureLinks(message) {
    if (message.author.id === clientId) return;
    if (!channels["allowed_channels"].includes(message.channelId) && !channels["allowed_channels"].includes(message.channel.parentId)) {
        const userLink = /https:\/\/scratch\.mit\.edu\/users\/\S+/g;
        const projectLink = /https:\/\/scratch\.mit\.edu\/projects\/\S+/g;
        const studioLink = /https:\/\/scratch\.mit\.edu\/studios\/\S+/g;

        if (userLink.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep profile advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
        if (projectLink.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep project advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939 and https://discord.com/channels/1140996822131802192/1145818943462850581. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
        if (studioLink.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep studio advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939 and https://discord.com/channels/1140996822131802192/1141402927999762462. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
    }
}

async function autoReact(message) {
    if (message.channelId === channels['arts-creations']) {
        const snapshot = message.messageSnapshots.first();

        const hasAttachment = (message.attachments.size > 0) || (snapshot?.attachments.size > 0);

        if (hasAttachment) {
            message.react('⭐').catch(() => null);
            message.react('❤️').catch(() => null);
        }
    }

    for (const reaction of reactions) {
        if (reaction.regex.test(message.content.toLowerCase())) {
            message.react(reaction.emoji).catch(() => null);
        }
    }
}

/**
 * Capture requests for collaboration and direct users to the proper channel
 * @param {object} message 
 */

async function captureCollab(message) {
    if (message.author.id === clientId) return;
    if (message.channel.parentId === channels['help-channel']) return; 

    const content = message.content.toLowerCase();
    const keyphrases = [
        "collab with",
        "i am hiring",
        "looking for a collab",
        "looking for someone to collab with",
        "join a collab",
        "invite me to a collab"
    ];

    if (keyphrases.some(phrase => content.includes(phrase) )) {
        message.reply(components.container(
            `👋 Hey <@${message.author.id}>, if you are looking to collaborate with someone, please use https://discord.com/channels/1140996822131802192/1141402927999762462 to get assistance!`,
            16756224
        ));
    }
}

/**
 * Redirect help requests to the currect channel
 * @param {Message} message
 */

async function captureHelp(message) {
    if (message.author.id === clientId) return;
    if (message.channel.parentId === channels['help-channel']) return;

    const content = message.content.toLowerCase();

    const keyphrases = [
        "get help",
        "help me",
        "help with",
        "i need help"
    ];

    if (keyphrases.some(phrase => content.includes(phrase))) {
        message.reply(components.container(
            `👋 Hey <@${message.author.id}>, please check out https://discord.com/channels/1140996822131802192/1141083052076957887 if you need help!`,
            16756224
        ));
    }
}

/**
 * Delete advertising attempts
 * @param {Message} message
 */

async function antiAdvertise(message) {
    if (message.author.id === clientId) return;
    if (message.channel.id === '1140996823364943939') return;
    if (message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

    if (/discord.com\/invite\/[a-zA-Z0-9-]+/i.test(message.content) || /discord.gg\/[a-zA-Z0-9-]+/i.test(message.content)) {
        message.reply(components.container(
            `‼️ Hey <@${message.author.id}>, server advertisements aren't allowed here. Please move to https://discord.com/channels/1140996822131802192/1140996823364943939 if you wish to advertise.`,
            16756224
        ));

        setTimeout(() => {
            message.delete().catch(() => null);
        }, 1000);
    }
};

/**
 * Various ""AI"" functions
 * @param {Message} message 
 */

async function ai(message) {
    if (message.author.id === clientId) return;
    const content = message.content;
    const mentioned = message.mentions.users.has(clientId) || /\bscratchie\b/i.test(content);
    // easy early return if scratchie is not mentioned.
    if (!mentioned) return;
    const normalized = normalize(content);

    const conditions = [
        () => {
            const greeting = /\b(hi|hello)\b/.test(normalized);

            if (greeting) {
                return replies.greetings[randomArrayInt(replies.greetings.length)];
            }

            return null;
        },
        () => {
            const keywords = [
                "true",
                "false",
                "right",
                "wrong",
                "bad",
                "correct",
                "incorrect",
                "good",
                "real"
            ];

            if (keywords.some(word => content.includes(word))) {
                const processed = semanticize(normalized);
                // "scratchie is this true" -> "scratchie true" -> false -> random
                // this is so that those types of questions aren't deterministic
                if (processed.split(' ').length > 2) {
                    const hash = crypto.createHash('sha256').update(processed).digest();
                    return replies.eightball[hash.readUInt32BE(0) % replies.eightball.length];
                } else {
                    return replies.eightball[randomArrayInt(replies.eightball.length)];
                }
            }

            return null;
        },
        () => {
            const beginning = replies.prefixes[randomArrayInt(replies.prefixes.length)];

            const truth = () => {
                return `${beginning} ${replies.truths[randomArrayInt(replies.truths.length)]}`;
            }

            const dare = () => {
                return `${beginning} ${replies.dares[randomArrayInt(replies.dares.length)]}`;
            }

            if (/\btruth\b/.test(normalized) && /\bdare\b/.test(normalized)) {
                if (Math.random() >= 0.5) {
                    return truth();
                } else {
                    return dare();
                }
            } else if (/\btruth\b/.test(normalized)) {
                return truth();
            } else if (/\bdare\b/.test(normalized)) {
                return dare();
            }

            return null;
        }
    ]

    for (const condition of conditions) {
        const text = condition();

        if (text !== null) {
            await type(message);
            message.reply(text);
            break;
        }
    }
}

module.exports = [
    linkProfile,
    linkProject,
    linkStudio,
    captureLinks,
    autoReact,
    captureHelp,
    antiAdvertise,
    captureCollab,
    ai
]
