const Discord = require('discord.js');
require('dotenv').config();
const fetch = require("node-fetch");
const utf8 = require('utf8');
const moment = require('moment');
const momentTz = require('moment-timezone');
const tzlookup = require("tz-lookup");
const {flag, code, name, countries} = require('country-emoji');
const { codeToName } = require('country-emoji/dist/lib');
const userGlobalSchema = require('../../models/userGlobal');

function direction (x) {
  if (x == 90) {
    return `⬆️ (${x}°)`
  }
  else if  (x == 270) {
    return `⬇️ (${x}°)`
  }
  else if  (x == 180) {
    return `⬅️ (${x}°)`
  }
  else if  (x == 360 || 0) {
    return `➡️ (${x}°)`
  }
  else if  (x > 0 && x < 90) {
    return `↗️ (${x}°)`
  }
  else if  (x > 270 && x < 360) {
    return `↘️ (${x}°)`
  }
  else if  (x > 180 && x < 270) {
    return `↙️ (${x}°)`
  }
  else if  (x > 90 && x < 180) {
    return `↖️ (${x}°)`
  }
};
function capitalize (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function weather (x) {
  if (x >= 210 && x <= 221) {
    return '⛈️'
  }
  else if  (x >= 200 && x <= 202) {
    return '🌩️'
  }
  else if  (x >= 230 && x <= 232) {
    return '⛈️'
  }
  else if  (x >= 300 && x <= 321) {
    return '🌧️'
  }
  else if  (x >= 500 && x <= 504) {
    return '🌦️'
  }
  else if  (x == 511) {
    return '🌨️'
  }
  else if  (x >= 520 && x <= 531) {
    return '🌧️'
  }
  else if  (x >= 600 && x <= 622) {
    return '❄️'
  }
  else if  (x >= 701 && x <= 781) {
    return '🌫️'
  }
  else if  (x == 800) {
    return '☀️'
  }
  else if  (x == 801) {
    return '⛅'
  }
  else if  (x >= 802 && x <= 804) {
    return '☁️'
  }
}
function localTime(x) {
  d = new Date()
  localTime = d.getTime()
  localOffset = d.getTimezoneOffset() * 60000
  utc = localTime + localOffset
  var time = utc + (1000 * x)
  nd = new Date(time)
  let ex = moment(nd).format ('lll')
  return ex
}
function location (x, y) {
  let loc = tzlookup(x, y)
  return loc
}
function toTimeZone(time, zone) {
  return moment(time, 'LT').tz(zone).format('LT');
}


module.exports = {
    name: 'weather',
    category: 'fun features',
    description: 'Displays info about the weather at the city saved for the user, or at the specified city. \n If it shows a city from another country than the one you expected, try to add a country code (e.g. US, GB, DE) beside the city (remember a comma after city), as shown below \n if it does not show up either, it may not be included in the weather API.',
    usage: `weather [save] <city>, [country code]`,
    run: async (client, message, args) => {
        //vi skal huske at lave en command der tjekker om personen har gemt location
        //if (!args[0])
        // check if user has saved location and post weather for that location
        // if not, send you did not specify a location
        let tokens = message.cleanContent.split(" ");
        let keywords = "coding train";
        if (tokens.length > 1) {
          keywords = tokens.slice(1, tokens.length).join(" ");
        }
        if (args[0] == 'save') {
          try {
            let tokens = message.cleanContent.split(" ");
            let keywords = "coding train";
            if (tokens.length > 2) {
              keywords = tokens.slice(2, tokens.length).join(" ");
            }
          let location = keywords
          await userGlobalSchema.findOneAndUpdate({
            userID: message.author.id
          }, {
            weather: location
          }, {
            upsert: true
          })
          return message.channel.send(`You have successfully saved the location **${location}**`)
        } catch {
          let location = keywords
          return message.channel.send(`Error, couldn't save your location **${location}**`)
        }
      }
        if (!args[0]) {
          await userGlobalSchema.findOne({
            userID: message.author.id
        }, async (err, res) => {
            if (err) console.error(err);
            if (!res.weather.length) {
              return message.channel.send(`You did not specify a city and haven't saved any! \nPlease use **save** in front of the location you want to save.`)
            } else {
              function localTime(x) {
                d = new Date()
                localTime = d.getTime()
                localOffset = d.getTimezoneOffset() * 60000
                utc = localTime + localOffset
                var time = utc + (1000 * x)
                nd = new Date(time)
                let ex = moment(nd).format ('lll')
                return ex
              }
              let keywords = res.weather
              let url = `https://api.openweathermap.org/data/2.5/weather?q=${keywords}&units=metric&appid=${process.env.WEATHERKEY}&lang=en`;
              let response = await fetch(utf8.encode(url));
              let json = await response.json();
              const answer = json;
              try {
                if (answer.weather[0].main == undefined) {
                  return message.channel.send(`No results found for the location ${keywords}.\n Your saved location may be invalid`)
                }
              }
              catch {
                return message.channel.send(`No results found for the location ${keywords}.\n Your saved location may be invalid`)
              }
                  const exampleEmbed = new Discord.MessageEmbed()
                  .setColor('#EB6E4B')
                  .setDescription(`Saved weather location for ${res.username}`)
                  .setAuthor('OpenWeather', 'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg', 'https://openweathermap.org/')
                  .setTitle(`${answer.weather[0].main} ${weather(answer.weather[0].id)} in ${answer.name}, ${codeToName(answer.sys.country)} ${flag(answer.sys.country)}`)
                  .setURL(`https://openweathermap.org/city/${answer.id}`)
                  .setThumbnail(`http://openweathermap.org/img/w/${answer.weather[0].icon}.png`)
                  .setTimestamp()
                  .addFields(
                    { name: 'Currently', value: `${capitalize(answer.weather[0].description)} ${weather(answer.weather[0].id)}`},
                    { name: 'Temperature', value: `${Math.round(answer.main.temp)}°C (${Math.round(answer.main.temp * 9/5 + 32)}°F)\n Feels like ${Math.round(answer.main.feels_like)}°C (${Math.round(answer.main.feels_like * 9/5 + 32)}°F)`, inline: true },
                    { name: 'Minimum Temperature.', value: `${Math.round(answer.main.temp_min)}°C (${Math.round(answer.main.temp_min * 9/5 + 32)}°F)`, inline: true },
                    { name: 'Maximum Temperature.', value: `${Math.round(answer.main.temp_max)}°C (${Math.round(answer.main.temp_max * 9/5 + 32)}°F)`, inline: true },
      
                    { name: 'Cloudiness', value: `${answer.clouds.all}%`, inline: true },
                    { name: 'Humidity', value: `${answer.main.humidity}%`, inline: true },
                    { name: 'Last updated at', value: toTimeZone((moment.unix(answer.dt)), location((answer.coord.lat), (answer.coord.lon))), inline: true },
      
                    { name: 'Local time', value: localTime(answer.timezone), inline: true },
                    { name: 'Sunrise', value: toTimeZone((moment.unix(answer.sys.sunrise)), location((answer.coord.lat), (answer.coord.lon))), inline: true },
                    { name: 'Sunset', value: toTimeZone((moment.unix(answer.sys.sunset)), location((answer.coord.lat), (answer.coord.lon))), inline: true },
      
                    { name: 'Pressure', value: `${answer.main.pressure} hPa`, inline: true },
                    { name: 'Wind Speed', value: `${answer.wind.speed} m/s`, inline: true },
                    { name: 'Wind Direction', value: direction(answer.wind.deg), inline: true },
                    )
                    message.channel.send(exampleEmbed)
              }
          });
        } else {
          function localTime(x) {
            d = new Date()
            localTime = d.getTime()
            localOffset = d.getTimezoneOffset() * 60000
            utc = localTime + localOffset
            var time = utc + (1000 * x)
            nd = new Date(time)
            let ex = moment(nd).format ('lll')
            return ex
          }
          let tokens = message.cleanContent.split(" ");
            let keywords = "coding train";
            if (tokens.length > 1) {
              keywords = tokens.slice(1, tokens.length).join(" ");
            }
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${keywords}&units=metric&appid=${process.env.WEATHERKEY}&lang=en`;
            let response = await fetch(utf8.encode(url));
            let json = await response.json();
            const answer = json;
           try {
            if (answer.weather[0].main == undefined) {
              return message.channel.send(`No results found for the location ${args[0]}.`)
            }
          }
          catch {
            return message.channel.send(`No results found for the location ${args[0]}.`)
          }
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#EB6E4B')
            .setAuthor('OpenWeather', 'https://pbs.twimg.com/profile_images/1173919481082580992/f95OeyEW_400x400.jpg', 'https://openweathermap.org/')
            .setTitle(`${answer.weather[0].main} ${weather(answer.weather[0].id)} in ${answer.name}, ${codeToName(answer.sys.country)} ${flag(answer.sys.country)}`)
            .setURL(`https://openweathermap.org/city/${answer.id}`)
            .setThumbnail(`http://openweathermap.org/img/w/${answer.weather[0].icon}.png`)
            .setTimestamp()
            .addFields(
              { name: 'Currently', value: `${capitalize(answer.weather[0].description)} ${weather(answer.weather[0].id)}`},
              { name: 'Temperature', value: `${Math.round(answer.main.temp)}°C (${Math.round(answer.main.temp * 9/5 + 32)}°F)\n Feels like ${Math.round(answer.main.feels_like)}°C (${Math.round(answer.main.feels_like * 9/5 + 32)}°F)`, inline: true },
              { name: 'Minimum Temperature.', value: `${Math.round(answer.main.temp_min)}°C (${Math.round(answer.main.temp_min * 9/5 + 32)}°F)`, inline: true },
              { name: 'Maximum Temperature.', value: `${Math.round(answer.main.temp_max)}°C (${Math.round(answer.main.temp_max * 9/5 + 32)}°F)`, inline: true },

              { name: 'Cloudiness', value: `${answer.clouds.all}%`, inline: true },
              { name: 'Humidity', value: `${answer.main.humidity}%`, inline: true },
              { name: 'Last updated at', value: toTimeZone((moment.unix(answer.dt)), location((answer.coord.lat), (answer.coord.lon))), inline: true },

              { name: 'Local time', value: localTime(answer.timezone), inline: true },
              { name: 'Sunrise', value: toTimeZone((moment.unix(answer.sys.sunrise)), location((answer.coord.lat), (answer.coord.lon))), inline: true },
              { name: 'Sunset', value: toTimeZone((moment.unix(answer.sys.sunset)), location((answer.coord.lat), (answer.coord.lon))), inline: true },

              { name: 'Pressure', value: `${answer.main.pressure} hPa`, inline: true },
              { name: 'Wind Speed', value: `${answer.wind.speed} m/s`, inline: true },
              { name: 'Wind Direction', value: direction(answer.wind.deg), inline: true },
              )
              message.channel.send(exampleEmbed)
        }
    }
}