const { Client, Events, GatewayIntentBits, ChannelType, WebhookClient, AuditLogEvent } = require('discord.js');
const { token, loggingWebhook, statusUpdate } = require('./config.json');
const commands = require('./commands/export');
const components = require('./components/export');
const statuses = require('./data/status.json');
const get = require('./functions/fetch.js');
const Database = require('better-sqlite3');

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

const db = new Database('scratchUpdates.db');
db.prepare(`
    CREATE TABLE IF NOT EXISTS scratch_updates (
        key TEXT PRIMARY KEY,
        last_id TEXT
    )
`).run();

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

  const url = "https://api.scratch.mit.edu/news";
  const channelId = "1494743479006269510";
  const time = 12 * 60 * 60 * 1000;

  const updateCheck = async () => {
    try {
      const data = await get(url);
      if (!data) return;

      const latestItem = data[0];
      const latestId = String(latestItem.id);

      const row = db.prepare('SELECT last_id FROM scratch_updates WHERE key = ?').get('scratch_updates');

      if (!row) {
        db.prepare('INSERT INTO scratch_updates (key, last_id) VALUES (?, ?)').run('scratch_updates', latestId);
        console.log('int');
        return;
      }

      if (row.last_id !== latestId) {
        const newItems = [];
        for (const item of data) {
          if (String(item.id) === row.last_id) break;
          newItems.push(item);
        }
      }

      const itemsToAnnounce = newItems.length > 0 ? newItems.reverse() : [latestItem];
      db.prepare('UPDATE scratch_updates SET last_id = ? WHERE key = ?').run(latestId, 'scratch_updates');
      const channel = await client.channels.fetch(channelId);

      if (channel) {
        for (const item of itemsToAnnounce) {
            await channel.send(
              `## 📰 **News**\n` + `**${item.headline}**\n` + `${item.copy}\n` + `[View Source](${item.url})`
            );
          }
      } else {
        console.log('no new stuff found');
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  updateCheck();
  setInterval(updateCheck, time);

	const randomStatus = () => {
		const status = statuses[Math.floor(Math.random() * statuses.length)];
		return [{ name: status.content, type: status.type }];
	}
	client.user.setPresence({
		activities: randomStatus(),
		status: 'online',
	});

	setInterval(() => {
		client.user.setPresence({
			activities: randomStatus(),
			status: 'online',
		});
	}, 60000 * statusUpdate)
});

client.login(token);
