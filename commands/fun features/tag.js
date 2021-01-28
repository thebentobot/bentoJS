const mongoose = require('mongoose');
const Command = require('../../models/command');
require('dotenv').config();
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const Guild = require('../../models/guild');
const Discord = require('discord.js');


function capitalize (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

module.exports = {
    name: 'tag',
    aliases: ['cc'],
    category: 'fun features',
    description: 'Create or call customly made commands',
    usage: `tag <add/delete/edit/info/list> <tag name> [tag content, text or attachment]`,
    run: async (client, message, args) => {
      if (args[0]) {
        Command.findOne(
        { guildID: message.guild.id, command: args[1] });}
      if (args[0] === 'add') {
        if (!args[1])
        return message.channel.send(`You did not specify a custom command name!`).then(m => m.delete({timeout: 5000}));
        let files = message.attachments.array();
        if (!args.slice(2).join(" ") && files.length < 1)
        return message.channel.send(`No content specified!`).then(m => m.delete({timeout: 5000}));
        let text = trim(args, 3, message.content);
        let fileUrl = files[0] ? files[0].url : '';
        if (fileUrl) text = [text, fileUrl].join('\n');
        let newData = new Command({
          _id: mongoose.Types.ObjectId(),
        guildID: message.guild.id,
        messageAuthorId: message.author.id,
        authorName: message.author.tag,
        dateMade: new Date(),
        command: args[1],
        content: args.slice(2).join(" ") || fileUrl,
        });
        newData.save();
        message.channel.send(`Successfully created the command \`${args[1]}\``
        );}
      if (args[0] === 'delete') {
        const guildDB = await Guild.findOne({
            guildID: message.guild.id
        });
        const data = await Command.findOne({
            guildID: message.guild.id, command: args[1]
        });
        if (message.member.permissions.has("MANAGE_GUILD") || message.author.id == data.messageAuthorId) {
        Command.findOneAndDelete(
          { guildID: message.guild.id, command: args[1] })
          .exec(function(err, command) {
            if (err) {
              return message.channel.send('Error')
          }       
          if (!command) {
              return message.channel.send(`\`${args[1]}\` does not exist on this server.`).then(m => m.delete({timeout: 5000}));
          }  
          return message.channel.send(`Successfully deleted the command \`${args[1]}\``);
      });
        } else {
          return message.channel.send(`You are not authorised to delete this tag. \nCheck who owns this tag by using the command ${guildDB.prefix}tag info ${args[1]}`);
        }
        } 
      if (args[0] === 'edit') {
        const guildDB = await Guild.findOne({
            guildID: message.guild.id
        });
        const data = await Command.findOne({
            guildID: message.guild.id, command: args[1]
        });
        if (message.member.permissions.has("MANAGE_GUILD") || message.author.id == data.messageAuthorId) {
            let files = message.attachments.array();
            if (!args.slice(2).join(" ") && files.length < 1)
            return message.channel.send(`No content specified!`).then(m => m.delete({timeout: 5000}));
            let text = trim(args, 3, message.content);
            let fileUrl = files[0] ? files[0].url : '';
            if (fileUrl) text = [text, fileUrl].join('\n');
          Command.findOneAndUpdate(
            { guildID: message.guild.id, command: args[1] }, {content: args.slice(2).join(" ") || fileUrl })
            .exec(function(err, command) {
              if (err) {
                return message.channel.send('Error')
            }
            if (!command) {
                return message.channel.send(`\`${args[1]}\` does not exist on this server.`).then(m => m.delete({timeout: 5000}));
            }
            if (!args.slice(2).join(" ") && files.length < 1) {
              return message.channel.send(`No content specified!`).then(m => m.delete({timeout: 5000}));
            }
            return message.channel.send(`Successfully updated the command \`${args[1]}\``);
        });
          } else {
            return message.channel.send(`You are not authorised to update this tag. \nCheck who owns this tag by using the command ${guildDB.prefix}tag info ${args[1]}`)
      ;}
    }
    if (args[0] == 'info') {
        try {
            let data = await Command.findOne({
                guildID: message.guild.id, command: args[1]
            })
            let user = await message.guild.members.fetch(data.messageAuthorId)
            const embed = new Discord.MessageEmbed()
            .setColor(process.env.COLOR)
            .setAuthor(data.authorName, user.user.avatarURL({ format: "png", dynamic: true }))
            .setTitle(capitalize(data.command))
            .setTimestamp()
            .addFields(
                { name: 'Command name', value: data.command, inline: true},
                { name: 'Owner', value: data.authorName, inline: true},
                { name: 'Content', value: (data.content)},
                { name: 'Date made', value: data.dateMade, inline: true},
            )
          message.channel.send(embed)
        } catch {
            return message.channel.send(`\`${args[1]}\` does not exist on this server.`)
        }
    }
    if (args[0] == 'list') {
       Command.find({
        guildID: message.guild.id
    }).sort({
        command: 1,
    }).exec((err, res) => {
        if(err) console.log(err);
    
    if (!res) {
        return message.channel.send('Unable to DM tag list');
    }
    var page = Math.ceil(res.length / 50)
    
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`Tag list for ${message.guild.name}`)
    embed.setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png'}))
    embed.setColor(process.env.COLOR);

    let pg = parseInt(args[0]);
    if(pg != Math.floor(pg)) pg = 1;
    if(!pg) pg = 1;
    let end = pg * 50
    let start = (pg * 50) - 50;

    if (res.length === 0) {
        embed.addField('Error', 'No pages found!');
    } else if (res.length <= start) {
        embed.addField('Error', 'Page not found')
    } else if (res.length <= end) {
        embed.setFooter(`Page ${pg} of ${page}`)
        for ( i = start; i < res.length; i++) {
            embed.addField(`${i + 1}. ${res[i].command}`, `${res[i].content}`);
        }
    } else {
        embed.setFooter(`Page ${pg} of ${page}`)
        for ( i = start; i < end; i++) {
            embed.addField(`${i + 1}. ${res[i].command}`, `${res[i].content}`);
        }
    }
    message.channel.send(`${message.author.username}, I've DM'ed you a list of the tags on this server 😏`)
            client.users.fetch(message.author.id).then((user) => {
                user.send(embed)
        });
    });
    }
  },
};
