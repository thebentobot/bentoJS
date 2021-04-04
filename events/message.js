const mongoose = require('mongoose');
const Guild = require('../models/guild');
const userServer = require('../models/userServer');
const userGlobal = require('../models/userGlobal');
const Command = require('../models/command');
const Discord = require('discord.js');
const TikTokScraper = require('tiktok-scraper');
const fetch = require('node-fetch');
require('dotenv').config();
const moment = require('moment');
const InstagramScraper = require('instatouch');
const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

var markdownEscape = function(text) {
   if (text.includes('_', '*', '~')) {
     return `\`\`\`${text}\`\`\``
   } else {
     return text
   }
};

const cooldown = new Set();

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
              NSFW: 'disable',
              welcomeEnable: 'disable',
              welcomeMsg: '',
              tiktok: 'enable',
              instagram: 'enable',
              logChannelID: null,
              MsgLogChannelID: '',
              welcomeChannel: '',
              muteRole: '',
            })

            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send('This server was not in our database! We have now added and you should be able to use bot commands.').then(m => m.delete({timeout: 10000}));
        }
    });
    await userServer.findOne({
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
  await userGlobal.findOne({
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
      if (cooldown.has(userID)) {
      }
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
            cooldown.add(userID);
            setTimeout(() => {
              cooldown.delete(userID)
            }, 60000) // 1 minute
        }
        addXPserver(message.guild.id, message.member.id, 23).catch();
    
        const addXPglobal = async (userID, xpToAdd) => {
          if (cooldown.has(userID)) {
          }
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
                cooldown.add(userID);
            setTimeout(() => {
              cooldown.delete(userID)
            }, 60000) // 1 minute
            }
            addXPglobal(message.member.id, 23).catch();
            if (message.content.includes('tiktok.com')) {
              if (settings.tiktok == 'disable') {
                return
              }
              // need to check if it is a link before executing
              let checkUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
              if (checkUrl.test(message) == false) {
                return
              }
              let testString = message.content
              //console.log(message.content)
              const query = testString.match(/\bhttps?:\/\/\S+/gi);
              //const finalQuery = query[0]
              //console.log(finalQuery)
              const videoMeta = await TikTokScraper.getVideoMeta(query)
              const video = videoMeta.collector[0];
              //console.log(video)
              const videoURL = video.videoUrl
              const headers = videoMeta.headers;
              const response = await fetch(videoURL, {
                method: 'GET', headers
              });
              const buffer = await response.buffer()
              //console.log(response)
              //console.log(buffer)
              try {
              const embed = new Discord.MessageEmbed()
              .setTitle(`${markdownEscape(video.text)}`)
              .setFooter(moment.unix(video.createTime).format("dddd, MMMM Do YYYY, h:mm A"))
              .setColor('#000000')
              .setAuthor(video.authorMeta.name, video.authorMeta.avatar, `https://www.tiktok.com/@${video.authorMeta.name}?`)
              await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
              await message.channel.send(embed)
              } catch {
                return
              }
            }
            if (message.content.includes('instagram.com')) {
              if (settings.instagram == 'disable') {
                return
              }
              let checkUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
              if (checkUrl.test(message) == false) {
                return
              }
              let testString = message.content
              const query = testString.match(/\bhttps?:\/\/\S+/gi);
              const finalQuery = query[0]
              const data = await InstagramScraper.getPostMeta(finalQuery, 
                {
                  session:`sessionid=${process.env.IGsessionID}`
                })
              const openData = data.graphql.shortcode_media
              let place = await openData.location ? `, ${await openData.location.name}` : ''
              let verify = await openData.owner.is_verified ? '✅' : ''
        
                // 1 pic, no vid
              if (typeof openData.edge_sidecar_to_children === 'undefined' && openData.is_video == false) {
              try {
                  const embed = new Discord.MessageEmbed()
                  .setTitle(`${markdownEscape(await openData.owner.full_name)}`)
                  .setDescription(trim(markdownEscape(await openData.edge_media_to_caption.edges[0].node.text), 2048))
                  .setFooter(`${moment.unix(await openData.taken_at_timestamp).format("h:mm A dddd MMMM Do YYYY")}${place}`)
                  .setColor(process.env.COLOR)
                  .setAuthor(`${await openData.owner.username} ${verify}`, await openData.owner.profile_pic_url, `https://www.instagram.com/${await openData.owner.username}/`)
                  .setImage(await openData.display_url)
                  await message.channel.send(embed)
                } catch {
                  return
                }
              }
              // 1 vid, nothing else
              if (openData.is_video == true && typeof openData.edge_sidecar_to_children === 'undefined') {
                const response = await fetch(openData.video_url, {
                  method: 'GET'
                })
                const buffer = await response.buffer()
                const embed = new Discord.MessageEmbed()
                  .setTitle(`${markdownEscape(await openData.owner.full_name)}`)
                  .setDescription(trim(markdownEscape(await openData.edge_media_to_caption.edges[0].node.text), 2048))
                  .setFooter(`${moment.unix(await openData.taken_at_timestamp).format("h:mm A dddd MMMM Do YYYY")}${place}`)
                  .setColor(process.env.COLOR)
                  .setAuthor(`${await openData.owner.username} ${verify}`, await openData.owner.profile_pic_url, `https://www.instagram.com/${await openData.owner.username}/`)
                  await message.channel.send(embed)
                  await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
              }
              // more pics than 1, videos featured as well
              if (openData.edge_sidecar_to_children) {
                function media (post) {
                  if (post.is_video == false) {
                      return post.display_url
                  }
                  if (post.is_video == false) {
                    return ''
                  }
                }
                
                // borrowed function from the leaderboard command
                function generateLBembed(lb) {
                  const embeds = [];
                  let k = 10;
                  // loops through the children-posts for a post till there isn't any posts left
                  for(let i =0; i < lb.edge_sidecar_to_children.edges.length; i += 1) {
                      // loops through every children-post, one children-post = current: object Object
                      const current = lb.edge_sidecar_to_children.edges[i]
                      k += 1;
                      // if children-post is not a video, it pushes a normal embed page with an image
                      if (current.node.is_video == false) {
                      const embed = new Discord.MessageEmbed()
                      .setDescription(trim(markdownEscape(lb.edge_media_to_caption.edges[0].node.text), 2048))
                      .setColor(process.env.COLOR)
                      .setImage(media(current.node))
                      .setTitle(`${markdownEscape(lb.owner.full_name)}`)
                      .setFooter(`${moment.unix(lb.taken_at_timestamp).format("h:mm A dddd MMMM Do YYYY")}${place}`)
                      .setAuthor(`${lb.owner.username} ${verify}`, lb.owner.profile_pic_url, `https://www.instagram.com/${lb.owner.username}/`)
                      embeds.push(embed)
                    }
                      // if children-post has a video, it doesn't send an .setImage
                      // it only sends the embed, and the video url
                      // perhaps it's possible to check out of the function scope below, if an object has two objects (embed, current.node.video_url), and if so, then it uses that url
                      if (current.node.is_video == true) {
                        const embed = new Discord.MessageEmbed()
                        .setDescription(trim(markdownEscape(lb.edge_media_to_caption.edges[0].node.text), 2048))
                        .setColor(process.env.COLOR)
                        .setTitle(`${markdownEscape(lb.owner.full_name)}`)
                        .setFooter(`${moment.unix(lb.taken_at_timestamp).format("h:mm A dddd MMMM Do YYYY")}${place}`)
                        .setAuthor(`${lb.owner.username} ${verify}`, lb.owner.profile_pic_url, `https://www.instagram.com/${lb.owner.username}/`)
                        embeds.push([embed, current.node.video_url])
                      }
                  }
                  return embeds;
              }
                  let currentPage = 0;
                  const embeds = generateLBembed(openData)
                  let queueEmbed;
                  // if the first object in the array is a photo
                  if (typeof embeds[currentPage][1] == 'undefined') {
                    queueEmbed = await message.channel.send(`Current Picture: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                  }
                  // if the first object in the array is a video
                  if (typeof embeds[currentPage][1] != 'undefined') {
                    queueEmbed = await message.channel.send(`Current Video: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    const response = await fetch(embeds[currentPage][1], {
                      method: 'GET'
                    })
                    const buffer = await response.buffer()
                    await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
                  }
                  await queueEmbed.react('⬅️');
                  await queueEmbed.react('➡️');
                  await queueEmbed.react('❌');
                  queueEmbed.edit();
                  const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
                  const collector = queueEmbed.createReactionCollector(filter);
        
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === '➡️') {
                            if (currentPage < embeds.length-1) {
                              currentPage++; // change page
                              // if the current page doesn't have a video
                              if (typeof embeds[currentPage][1] == 'undefined') {
                                reaction.users.remove(user);
                                queueEmbed.edit(`Current Picture: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                                // if the last page has a video
                                if (typeof embeds[currentPage-1][1] != 'undefined') {
                                  await message.channel.messages.fetch({ limit: 1 }).then(messages => { 
                                    message.channel.bulkDelete(messages)});
                                }
                              }
                              // if the current page has a video
                              if (typeof embeds[currentPage][1] != 'undefined') {
                                // if the last page has a video
                                if (typeof embeds[currentPage-1][1] != 'undefined') {
                                  await message.channel.messages.fetch({ limit: 1 }).then(messages => { 
                                    message.channel.bulkDelete(messages)});
                                }
                                reaction.users.remove(user);
                                queueEmbed.edit(`Current Video: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                                const response = await fetch(embeds[currentPage][1], {
                                  method: 'GET'
                                })
                                const buffer = await response.buffer()
                                await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
                              }
                            } 
                          } else if (reaction.emoji.name === '⬅️') {
                            if (currentPage !== 0) {
                              --currentPage; // change page
                              // if the current page doesn't have a video
                              if (typeof embeds[currentPage][1] == 'undefined') {
                                reaction.users.remove(user);
                                queueEmbed.edit(`Current Picture ${currentPage+1}/${embeds.length}`, embeds[currentPage])
                                // if the last page has a video
                                if (typeof embeds[currentPage+1][1] != 'undefined') {
                                  await message.channel.messages.fetch({ limit: 1 }).then(messages => { 
                                    message.channel.bulkDelete(messages)});
                                }
                              }
                              // if the current page has a video
                              if (typeof embeds[currentPage][1] != 'undefined') {
                                // if the last page has a video
                                if (typeof embeds[currentPage+1][1] != 'undefined') {
                                  await message.channel.messages.fetch({ limit: 1 }).then(messages => { 
                                    message.channel.bulkDelete(messages)});
                                }
                                reaction.users.remove(user);
                                queueEmbed.edit(`Current Video ${currentPage+1}/${embeds.length}`, embeds[currentPage])
                                const response = await fetch(embeds[currentPage][1], {
                                  method: 'GET'
                                })
                                const buffer = await response.buffer()
                                await message.channel.send(new Discord.MessageAttachment(buffer, 'video.mp4'))
                              }
                            }
                          } else {
                            collector.stop();
                            await queueEmbed.delete();
                            if (typeof embeds[currentPage][1] != 'undefined') {
                              await message.channel.messages.fetch({ limit: 1 }).then(messages => { 
                                message.channel.bulkDelete(messages)});
                            }
                          }
                    })
              }
            }

    const prefix = settings.prefix;

    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.includes(`${prefix}?`)) return;
    if (message.content.includes(`${prefix}!`)) return;
    if (message.content.includes(`${prefix}+`)) return;
    if (message.content.includes(`${prefix}%`)) return;
    if (message.content.includes(`${prefix}/`)) return;
    if (message.content.includes(`${prefix}? `)) return;
    if (message.content.includes(`${prefix}! `)) return;
    if (message.content.includes(`${prefix}+ `)) return;
    if (message.content.includes(`${prefix}% `)) return;
    if (message.content.includes(`${prefix}/ `)) return;
    
    if (!message.member) message.member = await message.guild.fetchMember (message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
    if (!command) command = client.commands.get(client.aliases.get(cmd));    
   
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
  
};