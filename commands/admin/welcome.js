const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'welcome',
    aliases: [],
    category: 'admin',
    description: 'Welcome message settings.\nYou need to assign <channel> and <content> for it to work, and of course <enable>\n{user} or {usertag} - mention user\n{username} - mention username\n{discriminator} - mention the #0000 for the user\n{server} - mention server\n{memberCount} - the member count\n{space} - adds a new line\nUse reverse / (slash) in front of a channel e.g. for linking to a rules channel.',
    usage: ` is the prefix\nwelcome <status>\nwelcome <channel> <channelID>\nwelcome <enable/disable>\nwelcome <msg/message> <content>`,
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

        if (args.length < 1) {
            return message.channel.send(`You must specify what you want to do with welcome messages.\nUse \`${settings.prefix}help welcome\` to see how to use this command.`)
        };

        const msg = settings.welcomeMsg ? settings.welcomeMsg : 'Not configured'
        const chl = settings.welcomeChannel ? `<#${settings.welcomeChannel}>` : '`Not configured`'

        if (args[0] == 'status') {
            return message.channel.send(`
            Welcome messages is currently \`${settings.welcomeEnable}d\` on this server.\nThe Welcome message on this server is currently: \`${msg}\`.\nThe Welcome message channel on this server is currently in ${chl}.`)
        }

        if (args[0] == 'channel') {
            if (!args[1]) return message.channel.send('Please assign a channel id as the second argument')
            let regExp = /[a-zA-Z]/g;
            let channel = args[1]
            if (regExp.test(channel) == true) return message.channel.send(`Your channel id ${args[1]} was invalid.\nPlease use a valid channel id.`)
            await settings.updateOne({
                welcomeChannel: channel
            });
            return message.channel.send(`Welcome messages will now appear in <#${channel}>`);
        }

        if (args[0] == 'msg' || args[0] == 'message') {
            if (!args[1]) return message.channel.send('Please write a welcome message')
            let msg = args.slice(1).join(" ")
            await settings.updateOne({
                welcomeMsg: msg
            });
            return message.channel.send(`Your Welcome message is now: \`${msg}\`\nRemember to assign a channel where your welcome message will appear\n${settings.prefix}welcome channel <channelID>`);
        }

        if (args[0] == 'enable' || args[0] == 'disable') {
            await settings.updateOne({
                welcomeEnable: args[0]
            });
            return message.channel.send(`Welcome messages has been \`${args[0]}d\``);
        } else {
            return message.channel.send(`\`${args[0]}\` is an invalid argument for this command.\nYou must specify if you want to **enable** or **disable** Welcome messages for this for this server!\nWelcome messages is currently \`${settings.welcomeEnable}d\` on this server\nRemember to assign a Welcome message and what channel it should be sent in.\nUse \`${settings.prefix}help welcome\` if you need help!`)
        }
    }
}