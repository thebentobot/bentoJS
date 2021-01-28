require('dotenv').config();
const fetch = require("node-fetch");
const utf8 = require('utf8');

module.exports = {
    name: 'gif',
    aliases: [],
    category: 'fun features',
    description: 'Searches for random GIFs based on the search input',
    usage: `gif <search input>`,
    run: async (client, message, args) => {
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
            let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=off`;
            let response = await fetch(utf8.encode(url));
            let json = await response.json();
            const index = Math.floor(Math.random() * json.results.length);
            if (!json.results.length) {
              return message.channel.send('No GIFs found based on your search input.');
            } else {
              message.channel.send(json.results[index].url);
            }
          }
    }
}