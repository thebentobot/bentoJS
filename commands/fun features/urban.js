const Discord = require("discord.js");
const fetch = require('node-fetch');
const querystring = require('querystring');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    name: 'urban',
    category: 'fun features',
    description: 'Search for definitions on Urban dictionary',
    usage: `urban <search input>`,
    run: async (client, message, args) => {
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
      return;
    var args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'urban') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}

		const [answer] = list;

    	const exampleEmbed = new Discord.MessageEmbed()
    	.setColor(process.env.COLOR)
    	.setAuthor('Urban Dictionary', 'https://is4-ssl.mzstatic.com/image/thumb/Purple111/v4/81/c8/5a/81c85a6c-9f9d-c895-7361-0b19b3e5422e/mzl.gpzumtgx.png/246x0w.png', 'https://www.urbandictionary.com/')
		.setTitle(answer.word)
		.setURL(answer.permalink)
    	.setTimestamp()
		.addFields(
		{ name: 'Definition', value: trim(answer.definition, 1024) },
		{ name: 'Example', value: trim(answer.example, 1024) },
		{ name: 'Rating', value: `${answer.thumbs_up} :thumbsup: ${answer.thumbs_down} :thumbsdown:` },
		);
		message.channel.send(exampleEmbed);
	}
  }
}