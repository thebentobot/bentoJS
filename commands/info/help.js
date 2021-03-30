const { MessageEmbed } = require('discord.js');
const Guild = require('../../models/guild');
const mongoose = require('mongoose');
const { stringify } = require('querystring');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    description: 'Displays bot help message.',
    usage: `help [commandName]`,
    run: async (client, message, args) => {
        await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX,
                    logChannelID: null,
                    NSFW: 'disable',
                    welcomeEnable: 'disable',
                    welcomeMsg: '',
                    tiktok: 'enable',
                    instagram: 'enable',
                });
    
                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));
            }
        });

        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return helpMSG(client, message);
        }
    }
}

async function helpMSG(client, message) {
    const guildDB = await Guild.findOne({
        guildID: message.guild.id
    });

    const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('Help')
        .setThumbnail(client.user.avatarURL())
        .setDescription(`For a full list of commands, please type \`${guildDB.prefix}commands\` \nTo see more info about a specific command, please type \`${guildDB.prefix}help <command>\` without the \`<>\``)
        .addField('About Bento Bot 🍱', 'A Discord bot for chat moderation and fun features you did not know you needed on Discord.')
        .addField('Github', 'https://github.com/banner4422/bento')
        .setFooter('Created by Banner#1017');
    message.channel.send(embed);
}

async function getCMD(client, message, input) {
    const guildDB = await Guild.findOne({
        guildID: message.guild.id
    });

    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor('#ff0000').setDescription(info));
    }

    cmd.aliases = Array.prototype.slice.call(cmd.aliases)
    if (cmd.name) info = `**Command Name**: ${cmd.name}`
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${stringify({a}).slice(2)}\``).join(', ')}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${guildDB.prefix}${cmd.usage}`;
        embed.setFooter('<> = REQUIRED | [] = OPTIONAL')
    }
    if (cmd.usage2) info += `\n**Usage 2**: ${guildDB.prefix}${cmd.usage2}`;

    return message.channel.send(embed.setColor(process.env.COLOR).setDescription(info));
}