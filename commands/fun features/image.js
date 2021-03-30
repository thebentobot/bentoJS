const gis = require('g-i-s');
const Guild = require('../../models/guild');

module.exports = {
    name: 'image',
    aliases: ['img'],
    category: 'fun features',
    description: 'Searches for random images based on the search input',
    usage: `image <search input>`,
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
      let query;
      if (settings.NSFW == 'enable') {
        query = args.join(" ")
      }
      if (settings.NSFW == 'disable') {
        query = args.join(" ") + '&safe=on'
      }
      if(!query) return message.channel.send('You need to provide a search input!').then(m => m.delete({timeout: 5000}));
      gis(query, logResults);
      function logResults(error, results) {
        const index = Math.floor(Math.random() * results.length);
        if (error) {
          console.log(error);
          message.channel.send('Error');
        }
        else {
          try {
          message.channel.send(results[index].url);
        } catch (err) {
          message.channel.send(`No images found based on your search input \`${query}\`.`);
        }
        }
      }
  }
}