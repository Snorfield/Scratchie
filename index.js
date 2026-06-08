const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const commands = require('./commands/export');
const components = require('./components/export');
const messageHandlers = require('./handlers/message');
const statuses = require('./data/status.json');

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

client.on('messageCreate', message => {
	// Loop over handler functions and pass the message object into them
	for (const handler of messageHandlers) {
		handler(message);
	}
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

	const status = statuses[Math.floor(Math.random() * statuses.length)];
	client.user.setPresence({
		activities: [{ name: status.content, type: status.type }],
		status: 'online',
	});
});

client.login(token);