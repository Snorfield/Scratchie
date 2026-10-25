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
const emojis = require('../data/emojis.json');
const roles = require('../data/roles.json');
const reactions = [
    { regex: /penguinmod/i, emoji: '🐧' },
    { regex: /nitrobolt/i, emoji: '⚡' },
    { regex: /turbowarp/i, emoji: '🍡' },
    { regex: /^(hi|hello|hiya|sup|hey)$/i, emoji: `${emojis.wave}` },
    { regex: /\bgobo\b/i, emoji: '1563622043188990183' },
    { regex: /\bgiga\b/i, emoji: '1563622016962134197' },
    { regex: /\btera\b/i, emoji: '1563622030354685952' },
    { regex: /\bnano\b/i, emoji: '1563622962710577172' },
    { regex: /\bmilli\b/i, emoji: '1563622069311373493' },
    { regex: /\bpico\b/i, emoji: '1563622000281395403' },
    { regex: /\bzepto\b/i, emoji: '1563622055847399504' }
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
 * Redirect help and collaboration requests to the currect channel
 * @param {Message} message
 */

async function captureHelp(message) {
    if (message.author.id === clientId) return;
    if (message.channel.parentId === channels['help-channel']) return;

    const userRoles = message?.member?.roles?.cache;
    if (!userRoles) return;
    const hasLevelRole = userRoles.has(roles.Pico) || userRoles.has(roles.Dot);
    const newUser = (userRoles.has(roles.Member) && !hasLevelRole) || hasLevelRole;
    if (!newUser) return;

    const content = message.content.toLowerCase();

    const helpPhrases = [
        "get help",
        "help me",
        "help with",
        "i need help"
    ];

    if (helpPhrases.some(phrase => content.includes(phrase))) {
        return message.reply(components.container(
            `👋 Hey <@${message.author.id}>, please check out https://discord.com/channels/1140996822131802192/1141083052076957887 if you need help!`,
            16756224
        ));
    }

    // we don't need specific phrases for this because it's already returning if you're not a new member.
    // So we can assume a new member mentioning collab probably means this.
    if (content.includes('collab')) {
        return message.reply(components.container(
            `👋 Hey <@${message.author.id}>, please check out https://discord.com/channels/1140996822131802192/1141402927999762462 if you would like to collaborate!`,
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
    if (message.channel.id === channels['advertisement']) return;
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
