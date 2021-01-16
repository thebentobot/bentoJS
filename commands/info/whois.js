const { MessageEmbed } = require('discord.js');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    name: 'whois',
    category: 'info',
    description: 'Displays info about the mentioned user.',
    usage: `whois <@user/userID> to find a user. If no user is specified it shows your own profile`,
    run: async (client, message, args) => {
        //const { guild, channel} = message
        let userArray = message.content.split(" ");
        let userArgs = userArray.slice(1);
        //let user = message.mentions.users.first() || message.member.user
        //let member = guild.members.cache.get(user.id);
        let member = message.mentions.members.first() || message.guild.members.cache.get(userArgs[0]) || message.guild.members.cache.find(x => x.user.username.toLowerCase() === userArgs.slice(0).join(" ") || x.user.username === userArgs[0]) || message.member;

        try {
            const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(member.user.username)
            .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true }))
            .setDescription(`Here is some information I found for ${member}`)
            .addField('User ID', member.user.id)
            .addField('Account created at', member.user.createdAt)
            .addField('Joined server at', member.joinedAt)
            //.addField('Last message', member.lastMessage.content)
            .addField('Highest role', member.roles.highest)
            .addField('All roles', trim(member.roles.cache.map(r => `${r}`).join(' | '), 1024));
            return message.channel.send(embed).catch(err => console.error(err));
        } catch(err) {
            const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(member.user.username)
            .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true }))
            .setDescription(`Here is some information I found for ${member}`)
            .addField('User ID', member.user.id)
            .addField('Account created at', member.user.createdAt)
            .addField('Joined server at', member.joinedAt)
            //.addField('Last message', member.lastMessage.content)
            .addField('Highest role', member.roles.highest)
            .addField('All roles', 'You have too many roles for the Discord API to list');
            return message.channel.send(embed).catch(err => console.error(err));
        }
    }
}

