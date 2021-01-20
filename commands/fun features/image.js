const gis = require('g-i-s');

module.exports = {
    name: 'image',
    category: 'fun features',
    description: 'Searches for random images based on the search input',
    usage: `image <search input>`,
    run: async (client, message, args) => {
      const query = args.join(" ")
      if(!query) return message.channel.send('You need to provide a search input!').then(m => m.delete({timeout: 5000}));
      gis(query, logResults);

      function logResults(error, results) {
        const index = Math.floor(Math.random() * results.length);
        if (error) {
          console.log(error);
          message.channel.send('Error');
        }
        else {
          //console.log(JSON.stringify(results, null, '  '));
          try {
          message.channel.send(results[index].url);
        } catch (err) {
          message.channel.send('No images found based on your search input.');
        }
        }
      }
  }
}