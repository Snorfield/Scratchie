const { Client, Events, GatewayIntentBits, ChannelType } = require('discord.js');
const { token } = require('./config.json');
const commands = require('./commands/export');
const components = require('./components/export');
const statuses = require('./data/status.json');

// Handlers
const messageHandlers = require('./handlers/message');
const threadHandlers = require('./handlers/thread');

// Goose
const gooseChannel = "1140996823364943933";
const startGooseLore = require('./handlers/goose');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	// Execute a command if it exists
	if (commands[commandName]) {
		commands[commandName](interaction);
	} else {
		await interaction.editReply({ content: 'Command file not found' });
	}

});

client.on(Events.MessageCreate, message => {
	// Loop over handler functions and pass the message object into them
	for (const handler of messageHandlers) {
		handler(message);
	}
});

client.on(Events.ThreadCreate, (thread, created) => {
	for (const handler of threadHandlers) {
		handler(thread, created);
	}
});

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);


	/* TODO
	Make statuses rotate every so often. Low priority 
	*/
	const status = statuses[Math.floor(Math.random() * statuses.length)];
	client.user.setPresence({
		activities: [{ name: status.content, type: status.type }],
		status: 'online',
	});

	// Very goose
	const channel = await client.channels.fetch(gooseChannel);

	startGooseLore(channel);
});

client.login(token);
