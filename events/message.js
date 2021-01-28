const mongoose = require('mongoose');
const mongo = require('../utils/mongoose');
const Guild = require('../models/guild');
const userServer = require('../models/userServer');
const userGlobal = require('../models/userGlobal');
//const Command = require('../models/command');

module.exports = async (client, message) => {
    if (message.author.bot) return;

    const settings = await Guild.findOne({
        guildID: message.guild.id
    }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                prefix: process.env.PREFIX,
                logChannelID: null
            })

            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send('This server was not in our database! We have now added and you should be able to use bot commands.').then(m => m.delete({timeout: 10000}));
        }
    });
    const userS = await userServer.findOne({
        guildID: message.guild.id, userID: message.author.id
    }, (err, author) => {
        if (err) console.error(err)
        if (!author) {
            const newUserServer = new userServer({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                userID: message.author.id,
                username: message.author.tag,
                xp: 0,
                level: 1,
                muteCount: 0,
                warnCount: 0,
                kickCount: 0,
                banCount: 0
            })

            newUserServer.save()
            .then()
            .catch(err => console.error(err));
        }
    });
    const userG = await userGlobal.findOne({
        userID: message.author.id
    }, (err, author) => {
        if (err) console.error(err)
        if (!author) {
            const newUserGlobal = new userGlobal({
                _id: mongoose.Types.ObjectId(),
                userID: message.author.id,
                username: message.author.tag,
                xp: 0,
                level: 1,
                weather: '',
                horoscope: '',
                lastfm: ''
            })

            newUserGlobal.save()
            .then()
            .catch(err => console.error(err));
            return console.log(`${message.author.username} has joined our database`);
        }
    });
    
    const addXPserver = async (guildID, userID, xpToAdd) => {
        const getNeededXP = (level) => level * level * 100
        const result = await userServer.findOneAndUpdate(
            {
                guildID,
                userID,
            },
            {
                guildID,
                userID,
              $inc: {
                xp: xpToAdd,
              },
            },
            {
              upsert: true,
              new: true,
            }
          )
          let { xp, level } = result
        const needed = getNeededXP(level)

        if (xp >= needed) {
         ++level
            xp -= needed
            await userServer.updateOne(
                {
                  guildID,
                  userID,
                },
                {
                  level,
                  xp,
                }
              )
            }
        }
        addXPserver(message.guild.id, message.member.id, 23).catch();
    
        const addXPglobal = async (userID, xpToAdd) => {
            const getNeededXP = (level) => level * level * 100
            const result = await userGlobal.findOneAndUpdate(
                {
                    userID
                },
                {
                    userID,
                  $inc: {
                    xp: xpToAdd,
                  },
                },
                {
                  upsert: true,
                  new: true,
                }
              )
              let { xp, level } = result
            const needed = getNeededXP(level)
    
            if (xp >= needed) {
             ++level
                xp -= needed
                await userGlobal.updateOne(
                    {
                      userID,
                    },
                    {
                      level,
                      xp,
                    }
                  )
                }
            }
            addXPglobal(message.member.id, 23).catch();

    const prefix = settings.prefix;

    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    
    if (!message.member) message.member = await message.guild.fetchMember (message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
    if (!command) command = client.commands.get(client.aliases.get(cmd));    

    
    if (command) {
        command.run(client, message, args);
    }
    
   /*
   if (command) {
    {
        command.run(client, message, args);
    }
  } else {
    Command.findOne(
        { guildID: message.guild.id, command: cmd },
        async (err, data) => {
          if (err) throw err;
          if (data) {
              return message.channel.send(data.content);
          } else {
              return message.channel.send(`This command does not exist.\nUse ${prefix}Commands for a list of all commands. \nIf it was supposed to be a custom tag, it does not exist on this server.`);
        }
      }
    );
  }
  */
};