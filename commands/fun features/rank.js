const userServerSchema = require('../../models/userServer');
const userGlobalSchema = require('../../models/userGlobal');
const mongoose = require('mongoose');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const Discord = require('discord.js');

module.exports = {
    name: 'rank',
    aliases: ['lvl', 'level', 'xp'],
    category: 'fun features',
    description: 'Shows your rank',
    usage: `rank [user]`,
    run: async (client, message, args) => {
      try {
      if (!args.length) {
        const userServer = await userServerSchema.findOne({
          guildID: message.guild.id, userID: message.author.id
      });
        const userGlobal = await userGlobalSchema.findOne({
          userID: message.author.id
      }).catch(err => {console.log(`caught the error: ${err}`);
      return message.channel.send(`You were not found in the database. Try again`) });
      const embed = new Discord.MessageEmbed()
      .setColor(process.env.COLOR)
      .setTitle(`Rank for ${message.author.username}`)
      .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true }))
      .setTimestamp()
      .addFields(
        { name: 'Server Level', value: userServer.level},
        { name: 'Total Praises', value: userGlobal.praise, inline: true},
        { name: 'Global level', value: userGlobal.level, inline: true},
        { name: 'Server XP', value: trim(userServer.xp), inline: true},
        { name: 'Global XP', value: trim(userGlobal.xp), inline: true},
      )
      message.channel.send(embed)
      }
      let userID = args[0]
      const user = message.mentions.members.first() || await message.guild.members.fetch(userID)
      //const member = guild.members.cache.get(user.id)
      if (args[0] = user) {
        const userServer = await userServerSchema.findOne({
          guildID: message.guild.id, userID: user.id
      });
        const userGlobal = await userGlobalSchema.findOne({
          userID: user.id
      }).catch(err => {console.log(`caught the error: ${err}`);
      return message.channel.send(`You were not found in the database. Try again`) });
      const embed = new Discord.MessageEmbed()
      .setColor(process.env.COLOR)
      .setTitle(`Rank for ${user.username || user.user.username}`)
      .setThumbnail(user.user.avatarURL({ format: "png", dynamic: true }) || user.avatarURL({ format: "png", dynamic: true }))
      .setTimestamp()
      
      .addFields(
        { name: 'Server level', value: userServer.level},
        { name: 'Total Praises', value: userGlobal.praise},
        { name: 'Global level', value: userGlobal.level, inline: true},
        { name: 'Server XP', value: trim(userServer.xp), inline: true},
        { name: 'Global XP', value: trim(userGlobal.xp), inline: true},
      )
      
      message.channel.send(embed)
      }
    } catch {
      return message.channel.send(`Error. User is either not on the server or does not exist.`).then(m => m.delete({timeout: 5000}));
    }
  }
}
