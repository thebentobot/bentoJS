[Link to the Discord Support server](https://discord.gg/dd68WwP)

A link to invite the bot to a Discord server will be provided when I feel like it's ready for public use. If you ask nicely you may get a link while it's being developed, by contacting me on Github or Discord (Banner#1017)
# Bento Bot 🍱 (WIP)
A Discord bot with server moderation tools and various entertaining commands.

It is written in JavaScript, utilizing the [Discord.js](https://discord.js.org/#/) library, with the database being hosted by [MongoDB](https://www.mongodb.com/).

A website that lists leaderboards, command guide etc. will be implemented in the near future.

Disclaimer - This Discord bot project was started as a project to learn JavaScript and programming in general, so be wary of questionable code. Refactoring may occur in the future.

## List of notable features
- Tiktok & Instagram embedding
- Database that saves server info such as feature settings and welcome message, and user data such as XP/Levels and command info
- Unlimited custom commands (for the server only) that saves name for recall and content
- Horoscope
- Weather and time at a specific city, provided by [OpenWeather](https://openweathermap.org/)
- Chat XP/levels and ''praise'' leaderboard
- Custom welcome and goodbye messages, customisable by server
- GIF and Google Image search
- Urban Dictionary search

## Setup of the bot
### Install the repository
Either by using `git clone https://github.com/banner4422/bento.git`or downloading this repository.
When opening the project for the first time, remember to `npm install`for the node_modules.
### Sign up for various API's and other services
1. Install or sign up for an Atlas account on [MongoDB](https://www.mongodb.com/)
2. Signup on [Discord](https://discord.com/) and log into the [Discord Developer Portal](https://discord.com/developers/applications), where you need to create a bot, to obtain a Discord token, which will be used to communicate with the Discord API
3. Get an API key from [Tenor](https://tenor.com/gifapi/documentation), for the GIF functionality.
4. Get an API key from [OpenWeather](https://openweathermap.org/), for the weather and time functionality.
### Create environment variables in an `.env` file using [dotenv](https://www.npmjs.com/package/dotenv).
You need to define following environment variables:

`TOKEN=(Your Discord API token for your created bot)`

`PREFIX=(A prefix to call commands, default used by Bento is ?)`

`COLOR=(A default hex color used for embeds, default used by Bento is #ff8956)`

`db=(Your MongoDB Atlas link, or localhosted MongoDB. You can use other databases, but it would require a lot of refactoring)`

`TENORKEY=(Your obtained Tenor API key)`

`WEATHERKEY=(Your obtained OpenWeather API Key)`

`IGsessionID=(A SessionID for Instagram, optional but will minimalise the chance of getting blocked by Instagram when webscraping)`
## Development
The bot is mainly developed by [Christian](https://github.com/banner4422).

Pull requests are very welcome if the features/changes makes sense and are up to par in quality.

## Avatar credit
The avatar illustration is done by [Freepik](http://www.freepik.com).
