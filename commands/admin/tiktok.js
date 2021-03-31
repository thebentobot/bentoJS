const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'tiktok',
    aliases: [],
    category: 'admin',
    description: 'Enable or disable Tiktok embedding for this server.',
    usage: `tiktok <enable/disable/status>`,
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
            return message.channel.send(`You must specify if you want to **enable** or **disable** Tiktok embedding for this server!\nTiktok embedding is currently \`${settings.tiktok}d\` on this server`)
        };

        if (args[0] == 'status') {
            return message.channel.send(`Tiktok embedding is currently \`${settings.tiktok}d\` on this server`)
        }

        if (args[0] == 'enable' || args[0] == 'disable') {
            await settings.updateOne({
                tiktok: args[0]
            });
        } else {
            return message.channel.send(`\`${args[0]}\` is an invalid argument for this command.\nYou must specify if you want to **enable** or **disable** Tiktok embedding for this server!\nTiktok embedding is currently \`${settings.tiktok}d\` on this server`)
        }

        return message.channel.send(`Tiktok embedding has been \`${args[0]}d\``);
    }
}