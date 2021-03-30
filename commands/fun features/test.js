const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const userInstagram = require("user-instagram");


module.exports = {
    name: 'test',
    aliases: [],
    category: 'fun features',
    description: 'Display avatar for the specific user',
    usage: `test <user>`,
    run: async (client, message, args) => {
        const data = await userInstagram.getPostData('CMUYcFBh3vG')
        console.log(data)
    }
  }