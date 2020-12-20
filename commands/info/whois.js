const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'whois',
    category: 'info',
    description: 'Displays info about the mentioned user.',
    usage: `whois <@user/userID> to find a user. If no user is specified it shows your own profile`,
    run: async (client, message, args) => {
        const { guild, channel} = message
        const user = message.mentions.users.first() || message.member.user
        const member = guild.members.cache.get(user.id);

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(member.user.username)
            .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true }))
            .setDescription(`Here is some information I found for ${member}`)
            .addField('User ID', member.user.id)
            .addField('Account created at', member.user.createdAt)
            .addField('Joined server at', member.joinedAt)
            .addField('Last message', member.lastMessage.content)
            .addField('Highest role', member.roles.highest)
            .addField('All roles', member.roles.cache.map(r => `${r}`).join(' | ') || 'You have too many roles for the embed to handle');
            return message.channel.send(embed).catch(err => console.error(err));
    }
}
