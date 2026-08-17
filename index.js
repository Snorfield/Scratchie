const { Client, Events, GatewayIntentBits, ChannelType, WebhookClient, AuditLogEvent } = require('discord.js');
const { token, loggingWebhook } = require('./config.json');
const commands = require('./commands/export');
const components = require('./components/export');
const statuses = require('./data/status.json');

// Handlers
const messageHandlers = require('./handlers/message');
const threadHandlers = require('./handlers/thread');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration
	],
});

const logSystem = new WebhookClient({
	url: loggingWebhook
});

client.on(Events.GuildBanAdd, async ban => {
	try {
		const logs = await ban.guild.fetchAuditLogs({
			type: AuditLogEvent.MemberBanAdd,
			limit: 5
		})

		const entry = logs.entries.find(
			entry => entry.target?.id === ban.user.id
		);

		const reason = entry?.reason ?? 'No reason provided';
		await logSystem.send({
			username: 'Scratchie',
			content: `<@${ban.user.id}> (${ban.user.username} - ${ban.user.id}) was banned for reason:\n\`${reason}\``
		});
	} catch (error) {
		console.error(error);
	}
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

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);


	/* TODO
	Make statuses rotate every so often. Low priority 
	*/
	const status = statuses[Math.floor(Math.random() * statuses.length)];
	client.user.setPresence({
		activities: [{ name: status.content, type: status.type }],
		status: 'online',
	});
});

client.login(token);
