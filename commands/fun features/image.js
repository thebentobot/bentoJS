const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    name: 'image',
    category: 'fun features',
    description: 'Searches for random images based on the search input',
    usage: `image <search input>`,
    run: async (client, message, args) => {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
      return;
    var args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    var parts = message.content.split(" ")
    const command = args.shift().toLowerCase();
    if (command === 'image') {
      image(message, parts);
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		function image(message, parts) {
    
    var search = parts.slice(1).join('');
      
    var options = {
    url: "http://results.dogpile.com/serp?qc=images&q=" + search,
    method: "GET",
    headers: {
      Accept: "text/html",
      "User-Agent": "Chrome"
    }
  };

  request(options, function(error, response, responseBody) {
    if (error) {
      return;
    }

    $ = cheerio.load(responseBody);

    var links = $(".image a.link");

    var urls = new Array(links.length)
      .fill(0)
      .map((v, i) => links.eq(i).attr("href"));

    if (!urls.length) {
      return;
    }

    // Send result
    message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
  });
}
    }
}
}