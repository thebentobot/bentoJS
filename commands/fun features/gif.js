require('dotenv').config();
const fetch = require("node-fetch");
const utf8 = require('utf8');
const Guild = require('../../models/guild');

module.exports = {
    name: 'gif',
    aliases: [],
    category: 'fun features',
    description: 'Searches for random GIFs based on the search input',
    usage: `gif <search input>`,
    run: async (client, message, args) => {
      const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: process.env.PREFIX,
                NSFW: 'disable',
                welcomeEnable: 'disable',
                welcomeMsg: '',
                tiktok: 'enable',
                instagram: 'enable',
            })

            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send('This server was not in our database! We have added it, please retype this command.').then(m => m.delete({timeout: 10000}));
        }
    });
        let tokens = message.cleanContent.split(" ");
        if (!args.length) {
          return message.channel.send('You need to provide a search input!').then(m => m.delete({timeout: 5000}));
        }
        if (tokens[0] === `${process.env.PREFIX}choochoo`) {
            const index = Math.floor(Math.random() * replies.length);
            message.channel.send(replies[index]);
          } else if (tokens[0] == `${process.env.PREFIX}gif`) {
            let keywords = "coding train";
            if (tokens.length > 1) {
              keywords = tokens.slice(1, tokens.length).join(" ");
            }
            let url;
            if (settings.NSFW == 'enable') {
              url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=off`
            }
            if (settings.NSFW == 'disable') {
              url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`
            }
            let response = await fetch(utf8.encode(url));
            console.log(response)
            let json = await response.json();
            const index = Math.floor(Math.random() * json.results.length);
            if (!json.results.length) {
              return message.channel.send(`No GIFs found based on your search input \`${keywords}\`.`);
            } else {
              message.channel.send(json.results[index].url);
            }
          }
    }
}