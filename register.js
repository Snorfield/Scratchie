const { SlashCommandBuilder, InteractionContextType, REST, Routes} = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check slash commands')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .toJSON(),

    new SlashCommandBuilder()
        .setName('rule')
        .setDescription('Quickly check a rule')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .addStringOption(option =>
            option.setName('rule')
                .setDescription('idk what to put here yet')
                .setRequired(true)
                .addChoices(
                    {name:'Rule 1 | Stay safe!', value:'rule1'},
                    {name:'・ 1.01 - English or American', value:'1.1'},
                    {name:'——————————————————————', value:'1.separator'},
                    {name:'Rule 2 | Be respectful!', value:'rule2'},
                    {name:'・ 2.01 - Crap critique', value:'2.1'},
                    {name:'・ 2.02 - Negative painting', value:'2.2'},
                    {name:'・ 2.03 - Create clone of user', value:'2.3'},
                    {name:'——————————————————————', value:'2.separator'},
                    {name:'Rule 3 | Safe for Everyone (SFE)!', value:'rule3'},
                    {name:'・ 3.01 - Fantasies', value:'3.1'},
                    {name:'・ 3.02 - Gore and guts', value:'3.2'},
                    {name:'——————————————————————', value:'3.separator'},
                    {name:'Rule 4 | Authority are authority!', value:'rule4'},
                    {name:'・ 4.01 - Rule whining', value:'4.1'},
                    {name:'・ 4.02 - Mini moderation', value:'4.2'},
                    {name:'・ 4.03 - Third party', value:'4.3'},
                    {name:'——————————————————————', value:'4.separator'},
                    {name:'Rule 5 | Appropriate use of our channels!', value:'rule5'},
                    {name:'・ 5.01 - Requesting of stars', value:'5.1'},
                    {name:'・ 5.02 - Repost this', value:'5.2'},
                    {name:'・ 5.03 - Post not of your own (AI)', value:'5.3'},
                    {name:'・ 5.04 - Attention, please', value:'5.4'},
                    {name:'・ 5.05 - Postathon', value:'5.5'},
                    {name:'・ 5.06 - Art robbery', value:'5.6'},
                    
                )
        )
        .toJSON(),


    new SlashCommandBuilder()
        .setName('explore')
        .setDescription('Explore new quality scratch projects')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .toJSON(),

    new SlashCommandBuilder()
        .setName('news')
        .setDescription('View new Scratch news articles')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .toJSON(),

    new SlashCommandBuilder()
        .setName('project')
        .setDescription('View Scratch project information')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .addNumberOption(option =>
            option.setName('id')
                .setDescription('Project id')
                .setRequired(true)
        )
        .toJSON(),

    new SlashCommandBuilder()
        .setName('studio')
        .setDescription('View Scratch studio information')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .addNumberOption(option =>
            option.setName('id')
                .setDescription('Studio id')
                .setRequired(true)
        )
        .toJSON(),

    new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View Scratch user profile information')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username')
                .setRequired(true)
        )
        .toJSON(),

    new SlashCommandBuilder()
        .setName('password')
        .setDescription('You should ignore this command... or should you?')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .addStringOption(option =>
            option.setName('password')
                .setDescription('password')
                .setRequired(true)
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
