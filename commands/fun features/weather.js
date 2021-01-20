const Discord = require('discord.js');
require('dotenv').config();
const fetch = require("node-fetch");
const utf8 = require('utf8');
const moment = require('moment');
const momentTz = require('moment-timezone');
const tzlookup = require("tz-lookup");


module.exports = {
    name: 'weather',
    category: 'fun features',
    description: 'Displays info about the weather at the city saved for the user, or at the specified city.',
    usage: `weather [city, or save] [city]`,
    run: async (client, message, args) => {
        //vi skal huske at lave en command der tjekker om personen har gemt location
        //if (!args[0])
        // check if user has saved location and post weather for that location
        // if not, send you did not specify a location
        let tokens = message.cleanContent.split(" ");
        if (tokens.length > 1) {
          keywords = tokens.slice(1, tokens.length).join(" ");
        }
        if (args[0] == 'save') {
          return message.channel.send(`This feature is not implemented yet. Coming soon! \n Please search ${process.env.PREFIX}weather [location] for now.`).then(m => m.delete({timeout: 10000}));
      }
        if (!args[0]) {
            return message.channel.send(`You did not specify a city!`).then(m => m.delete({timeout: 5000}));
        } else {
            let tokens = message.cleanContent.split(" ");
            let keywords = "coding train";
            if (tokens.length > 1) {
              keywords = tokens.slice(1, tokens.length).join(" ");
            }
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${keywords}&units=metric&appid=${process.env.WEATHERKEY}&lang=en`;
            let response = await fetch(utf8.encode(url));
            let json = await response.json();
            const answer = json;
            /*
            if (!json.results) {
              return message.channel.send(`No results found for the location ${args[0]}.`)
            }
            */
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
            .setTitle(`${answer.weather[0].main} in ${answer.name}, ${answer.sys.country}`)
            .setThumbnail(`http://openweathermap.org/img/w/${answer.weather[0].icon}.png`)
            .setTimestamp()
            // vi skal fikse alle tider og være sikre på det er rigtigt.
            // Tiderne passer med CPH DK men ikke med andre steder.
            // vi skal gøre så det er den lokale tid for det sted den giver weather data på.
            // tiderne kommer ud i unix UTC og calculates til ja læselig data
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