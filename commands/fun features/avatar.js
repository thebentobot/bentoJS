const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");

module.exports = {
    name: 'avatar',
    category: 'fun features',
    description: 'Display avatar for the specific user',
    usage: `avatar <@user>`,
    run: async (client, message, args) => {
        let Embed = new MessageEmbed;
    var user;
      user = message.mentions.users.first(); //mentioned user, if any
      if (!user) {
        //if no one is mentioned
        if (!args[0]) {
          //if the command is only "!avatar". I.e. no one is mentioned and no id is specified
          user = message.author;
          getuseravatar(user);
        } else {
          //if a user id IS specified (need developer mode on on discord to get it)
          var id = args[0];
          client.users
            .fetch(id)
            .then(user => {
              getuseravatar(user); //get avatar of the user, whose id is specified
            })
            .catch(error => console.log(error));
        }
      } else {
        //if someone IS mentioned
        getuseravatar(user);
      }
      function getuseravatar(user) {
        var Embed = new Discord.MessageEmbed();
        Embed.setTitle(`${client.users.cache.get(user.id).tag}'s avatar!`);
        Embed.setImage(
          client.users.cache
            .get(user.id)
            .displayAvatarURL({ format: "png", size: 1024, dynamic: true })
        );
        Embed.setColor(process.env.COLOR);
        return message.channel.send(Embed);
      }
    }
  }