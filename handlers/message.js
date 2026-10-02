const get = require('../functions/fetch');
const components = require('../components/export');
const channels = require('../data/channels.json');
const answers = require('../data/eightball.json');
const config = require('../config.json');
const { clientId } = config;
const normalize = require('../functions/normalize');
const crypto = require('crypto');
const semanticize = require('../functions/semanticize');
const challenges = require('../data/challenges.json');
const randomArrayInt = require('../functions/random');
const type = require('../functions/type.js');
const { PermissionFlagsBits } = require('discord.js');

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const SCRATCH_PROFILE_REGEX = /scratch\.mit\.edu\/users\/([\w-]+)/i;
const SCRATCH_PROJECT_REGEX = /scratch\.mit\.edu\/projects\/(\d+)/i;
const SCRATCH_STUDIO_REGEX = /scratch\.mit\.edu\/studios\/(\d+)/i;

const SCRATCH_PROFILE_URL_REGEX = /https?:\/\/scratch\.mit\.edu\/users\/\S+/i;
const SCRATCH_PROJECT_URL_REGEX = /https?:\/\/scratch\.mit\.edu\/projects\/\S+/i;
const SCRATCH_STUDIO_URL_REGEX = /https?:\/\/scratch\.mit\.edu\/studios\/\S+/i;

const DISCORD_INVITE_REGEX = /(?:discord\.gg|discord(?:app)?\.com\/invite)\/[a-zA-Z0-9-]+/i;

const SCRATCHIE_WORD_REGEX = /\bscratchie\b/i;
const MULTI_SPACE_REGEX = /\s+/g;
const QUESTION_SPLIT_REGEX = /[.!]/;

const GREETING_TO_SCRATCHIE_REGEX = /\b(?:(?:hi|hello)\s*(?:[,;:!-]+\s*)?scratchie|scratchie\s*(?:[,;:!-]+\s*)?(?:hi|hello))\b/i;

const AUX_CUE = "(?:do|does|did|can|could|would|will|should|has|have|had|may|might|must|isn'?t|aren'?t|wasn'?t|weren'?t|don'?t|doesn'?t|didn'?t|can'?t|couldn'?t|wouldn'?t|won'?t|shouldn'?t|hasn'?t|haven'?t|hadn'?t|mightn'?t|mustn'?t)\\b";
const BE_CUE = "(?:is|are|am|was|were)\\s+(?:(?:this|that|it|these|those|you|i|we|they|he|she|my|your|our|their|his|her|the|a|an)\\b|there\\s+(?!scratchie\\b)[a-z0-9_]+\\b)";
const YES_NO_CUE = `(?:${AUX_CUE}|${BE_CUE})`;
const INFORMAL_YES_NO_CUE = '(?:(?:u|you)\\s+(?:think|reckon|believe|feel))\\b';
const NON_YES_NO_CUE = '(?:what|who|when|where|why|how|please|pls|tell|explain|describe|show|give|make|help)\\b';
const REQUEST_CUE = "(?:can|could|would|will|should|do)\\s+you\\s+(?:check|review|explain|tell|show|give|make|help|fix|describe)\\b";

const SCRATCHIE_QUESTION_START = new RegExp(`(?:^|[,;:!-]+\\s*|\\b(?:hi|hello)\\s*(?:[,;:!-]+\\s*)?)(?:hey\\s+)?scratchie\\b\\s*(?:[,;:!-]+\\s*)?(?:${YES_NO_CUE}|${INFORMAL_YES_NO_CUE})`, 'i');
const SCRATCHIE_REQUEST_START = new RegExp(`(?:^|[,;:!-]+\\s*)(?:hey\\s+)?scratchie\\b\\s*(?:[,;:!-]+\\s*)?${REQUEST_CUE}`, 'i');
const SCRATCHIE_MARKED_QUESTION_START = new RegExp(`(?:^|[,;:!-]+\\s*)(?:hey\\s+)?scratchie\\b(?:\\s*[,;:!-]+\\s*|\\s+)(?!${NON_YES_NO_CUE})(?=\\b(?!scratchie\\b)[a-z0-9_]+\\b)`, 'i');
const SCRATCHIE_END_QUESTION = /\b(?!scratchie\b)[a-z0-9_]+\b.*\bscratchie\s*$/i;
const INDIRECT_END = /\b(?:to|about|with|for|from|at|near|around|of)\s+scratchie\s*$/i;
const OBJECT_END = /\b(?:know|knew|known|meet|met|see|saw|seen|find|found|remember|like|hate|love|called|named)\s+scratchie\s*$/i;
const GREETING_END = /\b(?:hi|hello)\s*(?:[,;:-]\s*)?scratchie\s*$/i;
const NON_YES_NO_START = new RegExp(`^\\s*(?:${NON_YES_NO_CUE})`, 'i');
const YES_NO_START = new RegExp(`^\\s*(?:${YES_NO_CUE}|${INFORMAL_YES_NO_CUE})`, 'i');
const REQUEST_START = new RegExp(`^\\s*${REQUEST_CUE}`, 'i');
const APPROVAL_END = /\b(?:right|correct|true|false|real|good|bad|okay|ok|alright|wrong|fine|works|work|valid|approved|approve)\b.*\bscratchie\s*$/i;

const reactions = [
    { regex: /penguinmod/i, emoji: '🐧' },
    { regex: /scratch/i, emoji: '1216005306090393680' },
    { regex: /nitrobolt/i, emoji: '⚡' },
    { regex: /turbowarp/i, emoji: '🍡' },
    { regex: /\b(?:hi|hello|hiya|sup|hey)\b/i, emoji: '1359604048801829114' },
    { regex: /\bgobo\b/i, emoji: '1465845363326976343' },
    { regex: /\bgiga\b/i, emoji: '1465845449524252703' },
    { regex: /\btera\b/i, emoji: '1465845334126100695' },
    { regex: /\bnano\b/i, emoji: '1465845395753271316' }
];

/**
 * Capture Scratch profile links and send a preview of them
 * @param {object} message 
 */

async function linkProfile(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel?.parentId)) {
        const matches = (message.content).match(SCRATCH_PROFILE_REGEX);
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
 * @param {object} message 
 */

async function linkProject(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel?.parentId)) {
        const matches = (message.content).match(SCRATCH_PROJECT_REGEX);
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
 * @param {object} message 
 */

async function linkStudio(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (channels["allowed_channels"].includes(message.channelId) || channels["allowed_channels"].includes(message.channel?.parentId)) {
        const matches = (message.content).match(SCRATCH_STUDIO_REGEX);
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
 * @param {object} message 
 */

function captureLinks(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (!channels["allowed_channels"].includes(message.channelId) && !channels["allowed_channels"].includes(message.channel?.parentId)) {
        if (SCRATCH_PROFILE_URL_REGEX.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep profile advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
        if (SCRATCH_PROJECT_URL_REGEX.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep project advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939 and https://discord.com/channels/1140996822131802192/1145818943462850581. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
        if (SCRATCH_STUDIO_URL_REGEX.test(message.content)) {
            message.reply(components.container(
                `Hey <@${message.author.id}>, please keep studio advertisements to https://discord.com/channels/1140996822131802192/1140996823364943939 and https://discord.com/channels/1140996822131802192/1141402927999762462. \n-# If you weren't advertising, you can ignore this message.`,
                16756224
            ));
        }
    }
}

function addressText(message) {
    let content = message.content.toLowerCase();
    const activeClientId = clientId || config.clientId;

    if (activeClientId) {
        content = content.replace(new RegExp(`<@!?${escapeRegExp(activeClientId)}>`, 'g'), ' scratchie ');
    }

    if (activeClientId && message.mentions?.users?.has?.(activeClientId) && !SCRATCHIE_WORD_REGEX.test(content)) {
        content = `scratchie ${content}`;
    }

    return content.replace(MULTI_SPACE_REGEX, ' ').trim();
}

function isGreetingToScratchie(message) {
    const content = addressText(message);
    return GREETING_TO_SCRATCHIE_REGEX.test(content);
}

function isAddressedQuestionText(text, markedQuestion) {
    const isDirectYesNoQuestion = SCRATCHIE_QUESTION_START.test(text) && !SCRATCHIE_REQUEST_START.test(text);
    const addressedEnd = SCRATCHIE_END_QUESTION.test(text)
        && !INDIRECT_END.test(text)
        && !OBJECT_END.test(text)
        && !GREETING_END.test(text)
        && !NON_YES_NO_START.test(text)
        && !REQUEST_START.test(text);

    if (markedQuestion) {
        return isDirectYesNoQuestion
            || (SCRATCHIE_MARKED_QUESTION_START.test(text) && !SCRATCHIE_REQUEST_START.test(text))
            || addressedEnd;
    }

    return isDirectYesNoQuestion || (addressedEnd && (YES_NO_START.test(text) || APPROVAL_END.test(text)));
}

function isQuestionToScratchie(message) {
    const content = addressText(message);
    const questions = content
        .split('?')
        .slice(0, -1)
        .map(part => part.split(QUESTION_SPLIT_REGEX).pop().trim());

    return (
        questions.some(question => isAddressedQuestionText(question, true)) ||
        isAddressedQuestionText(content, false)
    );
}

/**
 * Capture 8ball questions and reply
 * @param {object} message 
 */

async function eightball(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;

    if (isQuestionToScratchie(message)) {
        const normalized = normalize(message.content);
        let toHash = normalized;

        if (message.reference?.messageId) {
            const reply = await message.fetchReference().catch(() => null);

            if (reply) {
                toHash = `${normalize(reply.content)} ${normalized}`;
            }
        }

        await type(message);

        if (semanticize(toHash).split(' ').length > 2 || message.reference?.messageId) {
            const hash = crypto.createHash('sha256').update(semanticize(toHash)).digest();
            return message.reply(
                answers[hash.readUInt32BE(0) % answers.length]
            );
        } else {
            return message.reply(
                answers[Math.floor(Math.random() * answers.length)]
            );
        }
    }
}

/**
 * Capture greetings addressed to the bot and reply
 * @param {object} message 
 */

async function greet(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;

    if (isGreetingToScratchie(message)) {
        const replies = ['Hi!!', 'Nice to see you, hi!', 'Hello there!', 'Yo!', 'How\'s it going?'];
        await type(message);
        return message.reply(
            replies[Math.floor(Math.random() * replies.length)]
        );
    }
}

/**
 * Capture truth or dare requests and respond
 * @param {object} message 
 */

async function truthOrDare(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    const content = message.content.toLowerCase();
    const normalized = normalize(message.content);

    function truth() {
        const beginning = challenges.message[randomArrayInt(challenges.message.length)];
        const truth = challenges.truths[randomArrayInt(challenges.truths.length)];
        return `${beginning} ${truth}`;
    }

    function dare() {
        const beginning = challenges.message[randomArrayInt(challenges.message.length)];
        const dare = challenges.dares[randomArrayInt(challenges.dares.length)];
        return `${beginning} ${dare}`;
    }

    if ((activeClientId && message.mentions?.users?.has?.(activeClientId)) || SCRATCHIE_WORD_REGEX.test(content)) {
        if (normalized.includes('truth') && normalized.includes('dare')) {
            await type(message);
            if (Math.random() >= 0.5) {
                return message.reply(truth());
            } else {
                return message.reply(dare());
            }
        } else if (normalized.includes('truth')) {
            await type(message);
            return message.reply(truth());
        } else if (normalized.includes('dare')) {
            await type(message);
            return message.reply(dare());
        }
    }
}

/**
 * Check messages to see if they are eligible for auto-reactions
 * @param {object} message 
 */

async function autoReact(message) {
    if (message.channelId === channels['arts-creations']) {
        const snapshot = message.messageSnapshots?.first?.();

        const hasAttachment = (message.attachments?.size > 0) || (snapshot?.attachments?.size > 0);

        if (hasAttachment) {
            message.react('⭐').catch(() => null);
            message.react('❤️').catch(() => null);
        }
    }

    for (const reaction of reactions) {
        if (reaction.regex.test(message.content)) {
            message.react(reaction.emoji).catch(() => null);
        }
    }
}

/**
 * Capture requests for help and direct users to the proper channel
 * @param {object} message 
 */

async function captureHelp(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (message.channel?.parentId === channels['help-channel']) return; 

    const content = message.content.toLowerCase();

    const keyphrases = [
        "get help",
        "help me",
        "help with",
        "i need help"
    ];

    if (keyphrases.some(phrase => content.includes(phrase) )) {
        message.reply(components.container(
            `👋 Hey <@${message.author.id}>, please check out https://discord.com/channels/1140996822131802192/1141083052076957887 if you need help!`,
            16756224
        ));
    }
}

/**
 * Capture Discord server links to warn the user not to advertise
 * @param {object} message 
 */

async function antiAdvertise(message) {
    const activeClientId = clientId || config.clientId;
    if (activeClientId && message.author.id === activeClientId) return;
    if (message.channelId === '1140996823364943939' || message.channel?.id === '1140996823364943939') return;
    if (message.member?.permissions?.has?.(PermissionFlagsBits.ModerateMembers)) return;

    if (DISCORD_INVITE_REGEX.test(message.content)) {
        message.reply(components.container(
            `‼️ Hey <@${message.author.id}>, server advertisements aren't allowed here. Please move to https://discord.com/channels/1140996822131802192/1140996823364943939 if you wish to advertise.`,
            16756224
        ));

        setTimeout(() => {
            message.delete?.().catch(() => null);
        }, 1000);
    }
}

module.exports = [
    linkProfile,
    linkProject,
    linkStudio,
    captureLinks,
    eightball,
    greet,
    truthOrDare,
    autoReact,
    captureHelp,
    antiAdvertise
];
