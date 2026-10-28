const { Client, Events, GatewayIntentBits, ChannelType, WebhookClient, AuditLogEvent, EmbedBuilder } = require('discord.js');
const { token, loggingWebhook, statusUpdate } = require('./config.json');
const commands = require('./commands/export');
const components = require('./components/export');
const statuses = require('./data/status.json');
const joinMsg = require('./data/joinMsg.json');
const leaveMsg = require('./data/leaveMsg.json');
const banMsg = require('./data/banMsg.json');
const channels = require('./data/channels.json');

// Handlers
const messageHandlers = require('./handlers/message');
const threadHandlers = require('./handlers/thread');
const randomArrayInt = require('./functions/random');
const joinMsgImg = [
	"https://media.discordapp.net/attachments/1513334966279344161/1564795932304875570/Nanojoin2.png?ex=6ae29146&is=6ae13fc6&hm=fb4cb77d1c505cc3d62adb031e278ac7ec9c53ecd2535835594ffcb97d9906c5&=&format=webp&quality=lossless",
	"https://media.discordapp.net/attachments/1513334966279344161/1564795934150234243/Scratchjoin2.png?ex=6ae29147&is=6ae13fc7&hm=5e5d85dc5d78fb68892a0bc1587342b9411cb4f7490364c77b7ecfc84d8b8369&=&format=webp&quality=lossless",
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564795934494298112/GoboJoin.png?ex=6ae29147&is=6ae13fc7&hm=c4bbe2c3846b84fd1c788afbc4960c59cf3975bef4d2d44296e82fee67f6b375&=&format=webp&quality=lossless",
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564805588721074307/Gigajoin.png?ex=6ae29a45&is=6ae148c5&hm=6e1f2a8a029cb796dc75b69c95505dd0b6bfb85b080d76956291679b5560f8cd&",
    "https://cdn.discordapp.com/attachments/1513334966279344161/1564805589299761202/Terajoin1.png?ex=6ae29a45&is=6ae148c5&hm=b8d63af6373ab27d6fe11dadb58b913ea645c102c4533cd17cd1c79dcc8b4d5f&",
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564805589631115344/Terajoin2.png?ex=6ae29a45&is=6ae148c5&hm=e1829115308827a1e9a46657ae69643012f65cb323c59cdf0194f2ee60ecde14&"
];
const leaveMsgImg = [
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564795932707397682/PicoAbandonment.png?ex=6ae29146&is=6ae13fc6&hm=cb09e24823e9ca1be101a35887ead9aa96fd9a89ecae6d1b45d1df2f489590c5&",
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564795933093527632/costume3_3.png?ex=6ae29146&is=6ae13fc6&hm=cf0b49099b0ce2f7478903edff5e1ea26114c9cdddbbc986c4785646b004ba5c&",
	"https://cdn.discordapp.com/attachments/1513334966279344161/1564795933441658900/gigaleave.png?ex=6ae29147&is=6ae13fc7&hm=011aefd58c239dbfeecb592c722832adead3ac20fedeb31d7fc18307bdf42817&"
];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMembers
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

    try {
		const channel = ban.guild.channels.cache.get(channels['welcome']);
		if (!channel) return;

        const rawMsg = banMsg[Math.floor(Math.random() * banMsg.length)];
		const formattedMsg = rawMsg
		 .replaceAll('{mention}', ban.user.toString())
         .replaceAll('{server(members)}', ban.guild.memberCount.toString());

		const banChannelEmbed = new EmbedBuilder()
		  .setAuthor({
			name: `🚫 | ${ban.guild.memberCount} members`,
		  })
		  .setColor('#d87e7e')
          .setDescription(formattedMsg)
		  .setFooter({ 
          text: `🚩 ${ban.user.username} should've done better...`
		})
		.setImage('https://cdn.discordapp.com/attachments/1513334966279344161/1564802706118549664/BANNED.png?ex=6ae29795&is=6ae14615&hm=ad87631374c0c8111c5a7c2650fa4b9ebc481866c7cb1e243fce2a4c38b2215d&');

		await channel.send({ embeds: [banChannelEmbed] });
	} catch (error) {
		console.log(error);
	}
});

client.on('guildMemberAdd', async (member) => {
  const welcomeDmEmbed = new EmbedBuilder()
    .setColor('#f0a543')
    .setTitle(`✉️ You've got mail!`)
    .setDescription(`
	## Thank you for joining. We are happy to have you here with us in Scratch Community!
	<:terablush:1497663771433373866> <:teranauseated:1497665373913223351> <:teraneutral:1497666172022161608> <:terastarstruck:1468295970503524392> <:teralove:1468297304720277528> <:teralaugh:1468302443392798864> <:terajoy:1468304629803651125> <:terarainbow:1473097998908002314> <:terapuppy:1473102728250261506>
	**__We hope this server is a pleasant experience to you.__**
	In cases of enquiry/server concerns, our mod-mail form is: ||https://dyno.gg/form/55856153||
	Also, you may want to check out our [ticket system](https://discord.com/channels/1140996822131802192/1140996822903566347/1466229042385518746).
	In cases of emergency, our ban appeal form is: || https://dyno.gg/form/ba0b1678 ||
    
	# __IMPORTANT INFORMATION.__
	There are **NO** official scratch servers. **ALL** scratch servers are owned by fans of scratch, not official members of the Scratch Team! Staff are **not** Scratch Team!
	If you have any problems regarding scratch, that only a Scratch Team member can help you with (e.g. concerns about a ban), **YOU WILL NOT FIND HELP ON DISCORD!**
	If you need to contact the Scratch Team, you should [send them an email](https://scratch.mit.edu/contact-us/)!
	Automated DM to newcomers set up by the staff of Scratch Community.
	## __We will *never* message you on an alternate account, ask you to join a server, or invite you to a website of the 'Scratch Community' name. Beware of scams!__`)
	 .setThumbnail('https://media.discordapp.net/attachments/1140996822656106528/1345885362463178812/Stuff__SCICasd_1.png?ex=67c62ceb&is=67c4db6b&hm=b640e20124dcd53d198bfb97260b691987985d66e07510e83f68c076c0bb859f&=&form')
	 .setImage('https://media.discordapp.net/attachments/877924620311855104/1466242710620078315/scratchcommunityclogo.png?ex=697c086f&is=697ab6ef&hm=23a885fe76dc3877fbcb8c0a2476b3a54ed829322ed1db459db1e52fc100ce03&=&')
     .setFooter({ 
		text: '🐱 See you later!' 
	});

    try {
      await member.send({ embeds: [welcomeDmEmbed] });
    } catch (error) {
	  console.log(error);
	};

	try {
		const channel = member.guild.channels.cache.get(channels['welcome']);
		if (!channel) return;

        const rawMsg = joinMsg[Math.floor(Math.random() * joinMsg.length)];
		const formattedMsg = rawMsg
		  .replaceAll('{mention}', member.toString())
          .replaceAll('{server(members)}', member.guild.memberCount.toString());

		const joinChannelEmbed = new EmbedBuilder()
		  .setAuthor({
            name: `💚 | The ${member.guild.memberCount}th member!`,
          })
		  .setColor('#aee9a2')
          .setDescription(formattedMsg)
		  .setImage(joinMsgImg[randomArrayInt(joinMsgImg.length)])
		  .setFooter({ 
          text: `👋 ${member.user.username} has joined the server!`
		})
		  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

		await channel.send({ embeds: [joinChannelEmbed] });
	} catch (error) {
		console.log(error);
	}
});

client.on('guildMemberRemove', async (member) => {
  	try {
		const channel = member.guild.channels.cache.get(channels['welcome']);
		if (!channel) return;

        const rawMsg = leaveMsg[Math.floor(Math.random() * leaveMsg.length)];
		const formattedMsg = rawMsg
		  .replaceAll('{mention}', member.toString())
          .replaceAll('{server(members)}', member.guild.memberCount.toString());

		const leaveChannelEmbed = new EmbedBuilder()
		  .setAuthor({
            name: `🔴 | ${member.guild.memberCount} members`,
          })
		  .setColor('#d87e7e')
          .setDescription(formattedMsg)
		  .setFooter({ 
          text: `👋 ${member.user.username} has left the server!`
		})
		  .setImage(leaveMsgImg[randomArrayInt(leaveMsgImg.length)])
		  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

		await channel.send({ embeds: [leaveChannelEmbed] });
	} catch (error) {
		console.log(error);
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