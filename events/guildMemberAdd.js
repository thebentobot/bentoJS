const mongoose = require('mongoose');
const Guild = require('../models/guild');
const Server = require('../models/userServer');
const Global = require('../models/userGlobal');

module.exports = async (client, member) => {
    const guildData = await Guild.findOne({
        guildID: member.guild.id
    })
    if (guildData.welcomeEnable == 'disable') {
        return
    }
    const username = member.user.username + '#' + member.user.discriminator
    const msg = guildData.welcomeMsg
    const msgClean = msg
    .replace('{user}', member.user)
    .replace('{username}', member.user.username)
    .replace('{discriminator}', member.user.discriminator)
    .replace('{usertag}', username)
    .replace('{server}', member.guild.name)
    .replace('{memberCount}', member.guild.memberCount)
    .replace('{space}', '\n')
    .replace(`\\`, '').replace(`\\`, '').replace(`\\`, '').replace(`\\`, '').replace(`\\`, '').replace(`\\`, '')
    const channelID = guildData.welcomeChannel
    const channel = member.guild.channels.cache.get(channelID)
    channel.send(msgClean)
    const serverData = await Server.findOne({
        userID: member.id, guildID: member.guild.id
    })
    if (!serverData) {
        const newUserServer = new Server({
            _id: mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            guildName: member.guild.name,
            userID: member.id,
            username: username,
            xp: 0,
            level: 1,
            muteCount: 0,
            warnCount: 0,
            kickCount: 0,
            banCount: 0
        })
    
        newUserServer.save()
        .then()
        .catch(err => console.error(err));
    } else {
        return
    }
    const globalData = await Global.findOne({
        userID: member.id
    })
    if (!globalData) {
        const newUserGlobal = new Global({
            _id: mongoose.Types.ObjectId(),
            userID: member.id,
            username: username,
            xp: 0,
            level: 1,
            weather: '',
            horoscope: '',
            lastfm: ''
        })

        newUserGlobal.save()
        .then()
        .catch(err => console.error(err));
        return console.log(`${username} has joined our database`);
    } else {
        return
    }
};