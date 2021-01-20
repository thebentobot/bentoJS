require('dotenv').config();
const fetch = require("node-fetch");
const utf8 = require('utf8');
const moment = require('moment');
const momentTz = require('moment-timezone');


module.exports = {
    name: 'time',
    category: 'fun features',
    description: 'Displays the local time for a specifc city',
    usage: `time [city]`,
    run: async (client, message, args) => {
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
            try {
                if (answer.weather[0].main == undefined) {
                  return message.channel.send(`No results found for the location ${args[0]}.`)
                }
              }
              catch {
                return message.channel.send(`No results found for the location ${args[0]}.`)
              }
            function localTime(x) {
                d = new Date()
                localTime = d.getTime()
                localOffset = d.getTimezoneOffset() * 60000
                utc = localTime + localOffset
                var time = utc + (1000 * x)
                nd = new Date(time)
                let ex = moment(nd).format ('LLLL')
                return ex
            }
            let time = localTime(answer.timezone)
            message.channel.send(time)
        }
    }
}