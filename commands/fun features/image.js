const cheerio = require('cheerio');
const request = require('request');

const cooldown = new Set();

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

    if (cooldown.has(message.author.id)) {
      message.channel.send(`Stop spamming ${message.author}. \nIf needed, go here https://www.google.com/imghp?hl=en`).then(m => m.delete({timeout: 10000}));
    } else {
      if (command === 'image') {
        image(message, parts);
        if (!args.length) {
          return message.channel.send('You need to provide a search input!');
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
            return message.channel.send('An error occured when searching for an image. Try again later or with another input.');
          }
    
          $ = cheerio.load(responseBody);
    
          var links = $(".image a.link");
    
          var urls = new Array(links.length)
          .fill(0)
          .map((v, i) => links.eq(i).attr("href"));
    
          if (!urls.length) {
            return message.channel.send('No images found based on your search input.');
          }
    
          // Send result
          message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
          });

          cooldown.add(message.author.id);
          setTimeout(() => {
            cooldown.delete(message.author.id)
          }, 20000); // 20 seconds
        }
      }
    }
  }
}