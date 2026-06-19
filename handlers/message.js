const get = require('../functions/fetch');
const components = require('../components/export');
const channels = require('../data/channels.json');
const answers = require('../data/eightball.json');
const { clientId } = require('../config.json');
const normalize = require('../functions/normalize');
const crypto = require('crypto');
const semanticize = require('../functions/semanticize');

/**
 * Capture Scratch profile links and send a preview of them
 * @param {object} message 
 */

async function linkProfile(message) {
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
 * @param {object} message 
 */

async function linkProject(message) {
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
 * @param {object} message 
 */

async function linkStudio(message) {
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
 * @param {object} message 
 */

function captureLinks(message) {
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

function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addressText(message) {
    let content = message.content.toLowerCase();

    if (clientId) {
        content = content.replace(new RegExp(`<@!?${escapeRegExp(clientId)}>`, 'g'), ' scratchie ');
    }

    if (message.mentions.users.has(clientId) && !/\bscratchie\b/i.test(content)) {
        content = `scratchie ${content}`;
    }

    return content.replace(/\s+/g, ' ').trim();
}

function isGreetingToScratchie(message) {
    const content = addressText(message);

    return (
        /\b(?:hi|hello)\s*(?:[,;:-]+\s*)?scratchie\b/i.test(content) ||
        /\bscratchie\s*(?:[,;:-]+\s*)?(?:hi|hello)\b/i.test(content)
    );
}

function isAddressedQuestionText(text, markedQuestion) {
    const auxCue = "(?:do|does|did|can|could|would|will|should|has|have|had|may|might|must|isn'?t|aren'?t|wasn'?t|weren'?t|don'?t|doesn'?t|didn'?t|can'?t|couldn'?t|wouldn'?t|won'?t|shouldn'?t|hasn'?t|haven'?t|hadn'?t|mightn'?t|mustn'?t)\\b";
    const beCue = "(?:is|are|am|was|were)\\s+(?:(?:this|that|it|these|those|you|i|we|they|he|she|my|your|our|their|his|her|the|a|an)\\b|there\\s+(?!scratchie\\b)[a-z0-9_]+\\b)";
    const yesNoCue = `(?:${auxCue}|${beCue})`;
    const informalYesNoCue = '(?:(?:u|you)\\s+(?:think|reckon|believe|feel))\\b';
    const nonYesNoCue = '(?:what|who|when|where|why|how|please|pls|tell|explain|describe|show|give|make|help)\\b';
    const requestCue = "(?:can|could|would|will|should|do)\\s+you\\s+(?:check|review|explain|tell|show|give|make|help|fix|describe)\\b";
    const scratchieQuestionStart = new RegExp(`(?:^|[,;:!-]+\\s*)(?:hey\\s+)?scratchie\\b\\s*(?:[,;:!-]+\\s*)?(?:${yesNoCue}|${informalYesNoCue})`, 'i');
    const scratchieGreetingQuestionStart = new RegExp(`\\b(?:hi|hello)\\s*(?:[,;:!-]+\\s*)?scratchie\\b\\s*(?:[,;:!-]+\\s*)?(?:${yesNoCue}|${informalYesNoCue})`, 'i');
    const scratchieRequestStart = new RegExp(`(?:^|[,;:!-]+\\s*)(?:hey\\s+)?scratchie\\b\\s*(?:[,;:!-]+\\s*)?${requestCue}`, 'i');
    const scratchieMarkedQuestionStart = new RegExp(`(?:^|[,;:!-]+\\s*)(?:hey\\s+)?scratchie\\b(?:\\s*[,;:!-]+\\s*|\\s+)(?!${nonYesNoCue})(?=\\b(?!scratchie\\b)[a-z0-9_]+\\b)`, 'i');
    const scratchieEnd = /\bscratchie\s*$/i;
    const scratchieEndQuestion = /\b(?!scratchie\b)[a-z0-9_]+\b.*\bscratchie\s*$/i;
    const indirectEnd = /\b(?:to|about|with|for|from|at|near|around|of)\s+scratchie\s*$/i;
    const objectEnd = /\b(?:know|knew|known|meet|met|see|saw|seen|find|found|remember|like|hate|love|called|named)\s+scratchie\s*$/i;
    const greetingEnd = /\b(?:hi|hello)\s*(?:[,;:-]\s*)?scratchie\s*$/i;
    const nonYesNoStart = new RegExp(`^\\s*(?:${nonYesNoCue})`, 'i');
    const yesNoStart = new RegExp(`^\\s*(?:${yesNoCue}|${informalYesNoCue})`, 'i');
    const requestStart = new RegExp(`^\\s*${requestCue}`, 'i');
    const approvalEnd = /\b(?:right|correct|true|false|real|good|bad|okay|ok|alright|wrong|fine|works|work|valid|approved|approve)\b.*\bscratchie\s*$/i;
    const addressedEnd = scratchieEndQuestion.test(text) && scratchieEnd.test(text) && !indirectEnd.test(text) && !objectEnd.test(text) && !greetingEnd.test(text) && !nonYesNoStart.test(text) && !requestStart.test(text);

    if (markedQuestion) {
        return ((scratchieQuestionStart.test(text) || scratchieGreetingQuestionStart.test(text)) && !scratchieRequestStart.test(text)) || (scratchieMarkedQuestionStart.test(text) && !scratchieRequestStart.test(text)) || addressedEnd;
    }

    return ((scratchieQuestionStart.test(text) || scratchieGreetingQuestionStart.test(text)) && !scratchieRequestStart.test(text)) || (addressedEnd && (yesNoStart.test(text) || approvalEnd.test(text)));
}

function isQuestionToScratchie(message) {
    const content = addressText(message);
    const questions = content
        .split('?')
        .slice(0, -1)
        .map(part => part.split(/[.!]/).pop().trim());

    return (
        questions.some(question => isAddressedQuestionText(question, true)) ||
        isAddressedQuestionText(content, false)
    );
}

async function eightball(message) {
    const normalized = normalize(message.content);

    if (isQuestionToScratchie(message)) {
        let toHash = normalized;

        if (message.reference?.messageId) {
            const reply = await message.fetchReference().catch(() => null);

            if (reply) {
                toHash = `${normalize(reply.content)} ${normalized}`;
            }
        }

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

function greet(message) {
    const replies = ['Hi!!', 'Nice to see you, hi!', 'Hello there!'];

    if (isGreetingToScratchie(message)) {
        return message.reply(
            replies[Math.floor(Math.random() * replies.length)]
        );
    }
}

module.exports = [
    linkProfile,
    linkProject,
    linkStudio,
    captureLinks,
    eightball,
    greet
]
