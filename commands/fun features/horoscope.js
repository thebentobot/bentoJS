const aztroJs = require("aztro-js");
require('dotenv').config();
const Discord = require('discord.js');
const stc = require('string-to-color');
const userGlobalSchema = require('../../models/userGlobal');
const Guild = require('../../models/guild');

module.exports = {
    name: 'horoscope',
    aliases: ['horo', 'astro', 'zodiac'],
    category: 'fun features',
    description: 'Provides a horoscope based on day and sign. If you search signs, it provides a list of signs and their date range',
    usage: `horoscope <today/tomorrow/yesterday> [<sign>]\nhoroscope <save> <sign>`,
    run: async (client, message, args) => {
        const guildDB = await Guild.findOne({
            guildID: message.guild.id
        });
        function capitalize (s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
          }
        if (!args[0]) {
            return message.channel.send('You need to provide a timeframe!\nEither today, tomorrow or yesterday.').then(m => m.delete({timeout: 5000}));
        }
        if (args[0] == 'save') {
            try {
              let tokens = message.cleanContent.split(" ");
              let keywords = "coding train";
              if (tokens.length > 2) {
                keywords = tokens.slice(2, tokens.length).join(" ");
              }
            let horo = keywords
            await userGlobalSchema.findOneAndUpdate({
              userID: message.author.id
            }, {
              horoscope: horo
            }, {
              upsert: true
            })
            return message.channel.send(`You have successfully saved your zodiac sign **${horo}**`)
          } catch {
            let tokens = message.cleanContent.split(" ");
            let keywords = "coding train";
            if (tokens.length > 2) {
              keywords = tokens.slice(2, tokens.length).join(" ");
            }
            let horo = keywords
            return message.channel.send(`Error, couldn't save your zodiac sign **${horo}**`)
          }
        }
        if (args[0] == 'signs') {
            return message.channel.send('https://i.pinimg.com/736x/43/aa/50/43aa50c918f3bd03abb71b6d4aaf93c7--new-zodiac-signs-zodiac-signs-and-dates.jpg');
        }
        if (args[0] == 'today') {
            if (!args[1]) {
                await userGlobalSchema.findOne({
                  userID: message.author.id
              }, async (err, res) => {
                  if (err) console.error(err);
                  if (!res.horoscope.length) {
                    return message.channel.send(`You did not specify a zodiac sign and haven't saved any! \nPlease use **save** in front of the zodiac sign you want to save.`)
                  } else {
                      let sign = res.horoscope
                aztroJs.getTodaysHoroscope(sign, function(res) {
                        //console.log(res)
                        let response = res
                        const answer = response
                        if(answer.hasOwnProperty('error')) {
                            return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
                    });
            } else {
                let sign = args[1]
                aztroJs.getTodaysHoroscope(sign, function(res) {
                    //console.log(res)
                    let response = res
                    const answer = response
                    if(answer.hasOwnProperty('error')) {
                        return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
        if (args[0] == 'tomorrow') {
            if (!args[1]) {
                await userGlobalSchema.findOne({
                  userID: message.author.id
              }, async (err, res) => {
                  if (err) console.error(err);
                  if (!res.horoscope.length) {
                    return message.channel.send(`You did not specify a zodiac sign and haven't saved any! \nPlease use **save** in front of the zodiac sign you want to save.`)
                  } else {
                      let sign = res.horoscope
                aztroJs.getTomorrowsHoroscope(sign, function(res) {
                        //console.log(res)
                        let response = res
                        const answer = response
                        if(answer.hasOwnProperty('error')) {
                            return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
                    });
            } else {
                let sign = args[1]
                aztroJs.getTomorrowsHoroscope(sign, function(res) {
                    //console.log(res)
                    let response = res
                    const answer = response
                    if(answer.hasOwnProperty('error')) {
                        return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
        if (args[0] == 'yesterday') {
            if (!args[1]) {
                await userGlobalSchema.findOne({
                  userID: message.author.id
              }, async (err, res) => {
                  if (err) console.error(err);
                  if (!res.horoscope.length) {
                    return message.channel.send(`You did not specify a zodiac sign and haven't saved any! \nPlease use **save** in front of the zodiac sign you want to save.`)
                  } else {
                      let sign = res.horoscope
                aztroJs.getYesterdaysHoroscope(sign, function(res) {
                        //console.log(res)
                        let response = res
                        const answer = response
                        if(answer.hasOwnProperty('error')) {
                            return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
                    });
            } else {
                let sign = args[1]
                aztroJs.getYesterdaysHoroscope(sign, function(res) {
                    //console.log(res)
                    let response = res
                    const answer = response
                    if(answer.hasOwnProperty('error')) {
                        return message.channel.send(`Your sign is invalid, try ${guildDB.prefix}horoscope signs to see a list of signs`)
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
}