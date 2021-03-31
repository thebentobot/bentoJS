const Discord = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
require('dotenv').config();

module.exports = {
    name: 'settings',
    aliases: [],
    category: 'admin',
    description: 'Sends an overview of the server settings',
    usage: `settings`,
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            return message.channel.send('You do not have permission to use this command!').then(m => m.delete({timeout: 10000}));
        };

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX,
                    NSFW: 'disable',
                    welcomeEnable: 'disable',
                    welcomeMsg: '',
                    tiktok: 'enable',
                    instagram: 'enable',
                    logChannelID: null,
                    MsgLogChannelID: '',
                    welcomeChannel: '',
                    muteRole: '',
                    autoRole: '',
                    byeEnable: 'disable',
                    byeMsg: '',
                    byeChannel: '',
                })

                newGuild.save()
                .then(result => console.log(result))
                .catch(err => console.error(err));

                return message.channel.send('This server was not in our database! We have added it, please retype this command.').then(m => m.delete({timeout: 10000}));
            }
        });

        const modLog = settings.logChannelID ? `<#${settings.logChannelID}>`: 'Not configured'
        const msgLog = settings.MsgLogChannelID ? `<#${settings.MsgLogChannelID}>`: 'Not configured'
        const muteRole = settings.muteRole ? `<@&${settings.muteRole}>`: 'Not configured'
        const autoRole = settings.autoRole ? `<@&${settings.autoRole}>`: 'Not configured'

        const Embed = new Discord.MessageEmbed()
        .setAuthor('Bento 🍱', 'https://repository-images.githubusercontent.com/322448646/e3422d00-90d9-11eb-9d3d-2939e261681a', 'https://github.com/banner4422/bento')
        .setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png'}))
        .setTitle(`Server settings for ${message.guild.name}`)
        .setTimestamp()
        .setColor(process.env.COLOR)
        .addFields(
            {name: 'NSFW', value: `${settings.NSFW}d`, inline: true},
            {name: 'Tiktok', value: `${settings.tiktok}d`, inline: true},
            {name: 'Instagram', value: `${settings.instagram}d`, inline: true},
            {name: 'Welcome Mesages', value: `${settings.welcomeEnable}d`, inline: true},
            {name: 'Bye Messages', value: `${settings.byeEnable}d`, inline: true},
            {name: 'Mod log channel', value: `${modLog}`, inline: true},
            {name: 'Message log channel', value: `${msgLog}`, inline: true},
            {name: 'Mute role', value: `${muteRole}`, inline: true},
            {name: 'Auto assigned role', value: `${autoRole}`, inline: true},
        )

        return message.channel.send(Embed);
    }
}