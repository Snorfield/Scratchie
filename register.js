const { SlashCommandBuilder, InteractionContextType, REST, Routes } = require('discord.js');
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
        .setName('news')
        .setDescription('View new Scratch news articles')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
        .toJSON(),

    new SlashCommandBuilder()
        .setName('commands')
        .setDescription('View all commands')
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ])
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
