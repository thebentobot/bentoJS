const aztroJs = require("aztro-js");
require('dotenv').config();
const Discord = require('discord.js');
const stc = require('string-to-color');

module.exports = {
    name: 'horoscope',
    aliases: ['horo', 'astro'],
    category: 'fun features',
    description: 'Provides a horoscope based on day and sign. If you search signs, it provides a list of signs and their date range',
    usage: `horoscope <today/tomorrow/yesterday> <sign>`,
    run: async (client, message, args) => {
        function capitalize (s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
          }
        const sign = args[1]
        if (!args[0]) {
            return message.channel.send('You need to provide a timeframe!').then(m => m.delete({timeout: 5000}));
        }
        if (args[0] == 'signs') {
            return message.channel.send('https://i.pinimg.com/736x/43/aa/50/43aa50c918f3bd03abb71b6d4aaf93c7--new-zodiac-signs-zodiac-signs-and-dates.jpg');
        }
        if (!sign) {
            return message.channel.send('You need to provide a sign!').then(m => m.delete({timeout: 5000}));
        }
        if (args[0] == 'today') {
            aztroJs.getTodaysHoroscope(sign, function(res) {
                //console.log(res)
                let response = res
                const answer = response
                console.log(answer)
                if(answer.hasOwnProperty('error')) {
                    return message.channel.send(`Your sign is invalid, try ${process.env.PREFIX}horoscope signs to see a list of signs`)
                }
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor(stc(answer.color))
                .setAuthor(`${message.author.username}`)
                .setTitle(`${capitalize(sign)}'s horoscope for ${answer.current_date}`)
                .setDescription(answer.description)
                .setTimestamp()
                .addFields(
                    { name: 'Date Range', value: `Between ${answer.date_range}`, inline: true},
                    { name: 'Compatibility 😳', value: `${answer.compatibility} 😏`, inline: true},
                    { name: 'Mood', value: `${answer.mood}`, inline: true},
                    { name: 'Colour', value: `${answer.color}`, inline: true},
                    { name: 'Lucky number', value: `${answer.lucky_number}`, inline: true},
                    { name: 'Lucky time', value: `${answer.lucky_time}`, inline: true},
                    )
                    
                    message.channel.send(exampleEmbed)
            })
        }
        if (args[0] == 'tomorrow') {
            aztroJs.getTomorrowsHoroscope(sign, function(res) {
                //console.log(res)
                let response = res
                const answer = response
                console.log(answer)
                if(answer.hasOwnProperty('error')) {
                    return message.channel.send(`Your sign is invalid, try ${process.env.PREFIX}horoscope signs to see a list of signs`)
                }
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor(stc(answer.color))
                .setAuthor(`${message.author.username}`)
                .setTitle(`${capitalize(sign)}'s horoscope for ${answer.current_date}`)
                .setDescription(answer.description)
                .setTimestamp()
                .addFields(
                    { name: 'Date Range', value: `Between ${answer.date_range}`, inline: true},
                    { name: 'Compatibility 😳', value: `${answer.compatibility} 😏`, inline: true},
                    { name: 'Mood', value: `${answer.mood}`, inline: true},
                    { name: 'Colour', value: `${answer.color}`, inline: true},
                    { name: 'Lucky number', value: `${answer.lucky_number}`, inline: true},
                    { name: 'Lucky time', value: `${answer.lucky_time}`, inline: true},
                    )
                    
                    message.channel.send(exampleEmbed)
            })
        }
        if (args[0] == 'yesterday') {
            aztroJs.getYesterdaysHoroscope(sign, function(res) {
                //console.log(res)
                let response = res
                const answer = response
                console.log(answer)
                if(answer.hasOwnProperty('error')) {
                    return message.channel.send(`Your sign is invalid, try ${process.env.PREFIX}horoscope signs to see a list of signs`)
                }
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor(stc(answer.color))
                .setAuthor(`${message.author.username}`)
                .setTitle(`${capitalize(sign)}'s horoscope for ${answer.current_date}`)
                .setDescription(answer.description)
                .setTimestamp()
                .addFields(
                    { name: 'Date Range', value: `Between ${answer.date_range}`, inline: true},
                    { name: 'Compatibility 😳', value: `${answer.compatibility} 😏`, inline: true},
                    { name: 'Mood', value: `${answer.mood}`, inline: true},
                    { name: 'Colour', value: `${answer.color}`, inline: true},
                    { name: 'Lucky number', value: `${answer.lucky_number}`, inline: true},
                    { name: 'Lucky time', value: `${answer.lucky_time}`, inline: true},
                    )
                    
                    message.channel.send(exampleEmbed)
            })
        }
    }
}