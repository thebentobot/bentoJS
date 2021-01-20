const mongoose = require('mongoose');
const Command = require('../../models/command');
require('dotenv').config();

module.exports = {
    name: 'tag',
    category: 'fun features',
    description: 'Create or call customly made commands',
    usage: `tag <tag name> [tag content]`,
    run: async (client, message, args) => {
      if (args[0]) {
        Command.findOne(
        { guildID: message.guild.id, command: args[1] });}
      if (args[0] === 'add') {
        if (!args[1])
        return message.channel.send(`You did not specify a custom command name!`).then(m => m.delete({timeout: 5000}));
        if (!args.slice(2).join(" "))
        return message.channel.send(`No content specified!`).then(m => m.delete({timeout: 5000}));
        let newData = new Command({
          _id: mongoose.Types.ObjectId(),
        guildID: message.guild.id,
        messageAuthorId: message.author.id,
        command: args[1],
        content: args.slice(2).join(" "),
        });
        newData.save();
        message.channel.send(`Successfully created the command \`${args[1]}\``
        );}
      if (args[0] === 'delete') {
        // data is not defined
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
          return message.channel.send(`You are not authorised to delete this tag. \nCheck who owns this tag by using the command ${process.env.PREFIX}tag info ${args[1]}`);
        }
        } 
      if (args[0] === 'edit') {
        // data is not defined
        if (message.member.permissions.has("MANAGE_GUILD") || message.author.id == data.messageAuthorId) {
          Command.findOneAndUpdate(
            { guildID: message.guild.id, command: args[1] }, {content: args.slice(2).join(" ")})
            .exec(function(err, command) {
              if (err) {
                return message.channel.send('Error')
            }
            if (!command) {
                return message.channel.send(`\`${args[1]}\` does not exist on this server.`).then(m => m.delete({timeout: 5000}));
            }
            if (!args.slice(2).join(" ")) {
              return message.channel.send(`No content specified!`).then(m => m.delete({timeout: 5000}));
            }
            return message.channel.send(`Successfully updated the command \`${args[1]}\``);
        });
          } else {
            return message.channel.send(`You are not authorised to update this tag. \nCheck who owns this tag by using the command ${process.env.PREFIX}tag info ${args[1]}`)
      ;}
    }
  },
};