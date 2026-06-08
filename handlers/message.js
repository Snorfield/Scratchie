const get = require('../functions/fetch');
const components = require('../components/export');

/**
 * Capture Scratch profile links and send a preview of them
 * @param {object} message 
 */

async function linkProfile(message) {
    const matches = (message.content).match(/scratch\.mit\.edu\/users\/([a-zA-Z0-9-_]+)/);
    if (matches) {
        const username = matches[1];

        const information = await get(`https://api.scratch.mit.edu/users/${username}`);

        if (information) {
            message.reply(components.profile(information));
        }
    }
}

/**
 * Capture Scratch project links and send a preview of them
 * @param {object} message 
 */

async function linkProject(message) {
	const matches = (message.content).match(/scratch\.mit\.edu\/projects\/([0-9]+)/);
    if (matches) {
        const id = matches[1];

        const information = await get(`https://api.scratch.mit.edu/projects/${id}`);

        if (information) {
            message.reply(components.project(information));
        }
    }
}

/**
 * Capture Scratch profile and project links to warn the user not to advertise
 * @param {object} message 
 */

function captureLinks(message) {
    const userLink = /https:\/\/scratch\.mit\.edu\/users\/\S+/g;
	const projectLink = /https:\/\/scratch\.mit\.edu\/projects\/\S+/g;

	if (userLink.test(message.content)) {
		message.reply(components.container(
			"Hey, please don't advertise user profiles!\n-# If you weren't you can ignore this.",
			16756224
		));
	}
	if (projectLink.test(message.content)) {
		message.reply(components.container(
			"Hey, please don't advertise projects!\n-# If you weren't you can ignore this.",
			16756224
		));
	}
}

module.exports = [
    linkProfile,
	linkProject,
    captureLinks
]
