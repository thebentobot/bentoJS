const fetch = require('node-fetch');

fetch("https://aws.random.cat/meow").then(response => response.json());

module.exports = {
    name: 'cat',
    category: 'fun features',
    description: 'Display random cat pictures',
    usage: `cat`,
    run: async (client, message, args) => {
        if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
      return;
    var args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "cat") {
      const { file } = await fetch("https://aws.random.cat/meow").then(
        response => response.json()
      );

      message.channel.send(file);
    }
  }
}