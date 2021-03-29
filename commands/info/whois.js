const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const Discord = require('discord.js');


module.exports = {
    name: 'whois',
    aliases: ['profile', 'user'],
    category: 'info',
    description: 'Displays info about the mentioned user.',
    usage: `whois <@user/userID> to find a user. If no user is specified it shows your own profile`,
    run: async (client, message, args) => {
        if (!args.length) {
          const embed = new Discord.MessageEmbed()
          .setColor(process.env.COLOR)
          .setTitle(`Profile for ${message.author.tag}`)
          .setThumbnail(message.author.avatarURL({ format: 'png', dynamic: true }))
          .setTimestamp()
          .addFields(
            { name: 'Nickname on the server', value: message.member.displayName},
            { name: 'Status', value: message.member.presence.status, inline: true},
            { name: 'Last message', value: message.author.lastMessage, inline: true},
            { name: 'User ID', value: message.author.id},
            { name: 'Account created at', value: message.author.createdAt},
            { name: 'Joined server at', value: message.member.joinedAt, inline: true},
            { name: 'Highest role', value: message.member.roles.highest},
            { name: 'All roles', value: trim(message.member.roles.cache.map(r => `${r}`).join(' | '), 1024), inline: true},
          )
          message.channel.send(embed)
          }
          let userID = args[0]
          const user = message.mentions.members.first() || await message.guild.members.fetch(userID)
          if (args[0] = user) {
              console.log(user)
            const embed = new Discord.MessageEmbed()
          .setColor(process.env.COLOR)
          .setTitle(`Profile for ${user.tag}`)
          .setThumbnail(user.user.avatarURL({ format: 'png', dynamic: true }))
          .setTimestamp()
          .addFields(
            { name: 'Nickname on the server', value: user.displayName},
            { name: 'Status', value: user.presence.status, inline: true},
            { name: 'Last message', value: user.lastMessage, inline: true},
            { name: 'User ID', value: user.id},
            { name: 'Account created at', value: user.user.createdAt},
            { name: 'Joined server at', value: user.joinedAt, inline: true},
            { name: 'Highest role', value: user.roles.highest},
            { name: 'All roles', value: trim(user.roles.cache.map(r => `${r}`).join(' | '), 1024), inline: true},
          )
          message.channel.send(embed)
          }
    }
}
