const TikTokScraper = require('tiktok-scraper');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'test',
    aliases: [],
    category: 'fun features',
    description: 'testing',
    usage: `tag`,
    run: async (client, message, args) => {
        if (!message.author.id == '232584569289703424') {
            return message.channel.send('You are not the Banner and you are not allowed to use this command!')
        }
        const videoMeta = await TikTokScraper.getVideoMeta('https://www.tiktok.com/@24kyves/video/6916352827828800774')
        console.log(videoMeta)
        const video = videoMeta.collector[0];
        const videoURL = video.videoUrl
        console.log(videoURL)
        const headers = videoMeta.headers;
        const response = await fetch(videoURL, {
            method: 'GET', headers
        });
        const buffer = await response.buffer()
        console.log(response)
        console.log(buffer)
        
            const embed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setAuthor(video.authorMeta.name, video.authorMeta.avatar, `https://www.tiktok.com/@${video.authorMeta.name}?`)
            await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
            await message.channel.send(embed)
        
    }
}