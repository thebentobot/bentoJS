const mongoose = require('mongoose');
const Guild = require('../models/guild');
const Server = require('../models/userServer');

module.exports = async (client, member) => {
    const guildData = await Guild.findOne({
        guildID: member.guild.id
    })
    if (guildData.byeEnable == 'disable') {
        return
    }
    const username = member.user.username + '#' + member.user.discriminator
    const msg = guildData.byeMsg
    const msgClean = msg
    .replace('{user}', member.user)
    .replace('{username}', member.user.username)
    .replace('{discriminator}', member.user.discriminator)
    .replace('{usertag}', username)
    .replace('{server}', member.guild.name)
    .replace('{memberCount}', member.guild.memberCount)
    .replace('{space}', '\n')
    .replace(`\\`, '').replace(`\\`, '').replace(`\\`, '').replace(`\\`, '')
    const channelID = guildData.byeChannel
    const channel = member.guild.channels.cache.get(channelID)
    channel.send(msgClean)
    await Server.findOneAndDelete({
        userID: member.id, guildID: member.guild.id
    })
};