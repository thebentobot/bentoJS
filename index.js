const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const client = new Client();
const schedule = require('node-schedule');

client.commands = new Collection();
client.aliases = new Collection();
client.mongoose = require('./utils/mongoose');

client.categories = fs.readdirSync('./commands/');

// fun feature for the boys
schedule.scheduleJob('10 46 19 * * *', function(){
    client.channels.cache.get('668454896051159070').send('https://cdn.discordapp.com/attachments/802924837462999040/830465878474358854/v09044e00000c1cpjtd5o3sjgfc2blr0.mp4')
    let voiceChannel = client.channels.cache.get('668458345857941504')
    voiceChannel.join().then(connection => {
        const dispatcher = connection.play('./utils/godaften.mp3');
     dispatcher.on("end", end => {
       voiceChannel.leave();
       }).catch(err => console.log(err));
    })
    console.log('Så er klokken snart halv otte ahaha')
  });

config({
    path: `${__dirname}/.env`
});

['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded event '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});

client.mongoose.init();
client.login(process.env.TOKEN);