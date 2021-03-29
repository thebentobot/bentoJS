const userServerSchema = require('../../models/userServer');
const userGlobalSchema = require('../../models/userGlobal');
//const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
const Discord = require('discord.js');
require('dotenv').config();

module.exports = {
    name: 'leaderboard',
    aliases: ['ranking', 'rankings', 'lb'],
    category: 'fun features',
    description: 'Shows the XP/LVL leaderboard for a server, globally for the bot, or global praises',
    usage: `leaderboard [global/praise] [page number]`,
    run: async (client, message, args) => {
        // leaderboard for the server
        if (!args.length) {
            userServerSchema.find({
                guildID: message.guild.id
            }).sort({
                level: -1, xp: -1,
            }).exec((err, res) => {
                if(err) console.log(err);
            
            if (!res) {
                return message.channel.send('Unable to generate leaderboard');
            }
            var page = Math.ceil(res.length / 10)
            
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Leaderboard for ${message.guild.name}`)
            embed.setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png'}))
            embed.setColor(process.env.COLOR);

            let pg = parseInt(args[0]);
            if(pg != Math.floor(pg)) pg = 1;
            if(!pg) pg = 1;
            let end = pg * 10
            let start = (pg * 10) - 10;

            if (res.length === 0) {
                embed.addField('Error', 'No pages found!');
            } else if (res.length <= start) {
                embed.addField('Error', 'Page not found')
            } else if (res.length <= end) {
                embed.setFooter(`Page ${pg} of ${page}`)
                for ( i = start; i < res.length; i++) {
                    embed.addField(`${i + 1}. ${res[i].username}`, `Level ${res[i].level},  ${res[i].xp} XP`);
                }
            } else {
                embed.setFooter(`Page ${pg} of ${page}`)
                for ( i = start; i < end; i++) {
                    embed.addField(`${i + 1}. ${res[i].username}`, `Level ${res[i].level},  ${res[i].xp} XP`);
            }
            }
            message.channel.send(embed);
            });
        }
        if (args[0] == 'global') {
            await userGlobalSchema.find({
            }).sort({
                level: -1, xp: -1,
            }).exec( async (err, res) => {
                if(err) console.log(err);
            
            if (!res) {
                return message.channel.send('Unable to generate leaderboard');
            }
            let currentPage = 0;
            const embeds = generateLBembed(res)
            const queueEmbed = await message.channel.send(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
            await queueEmbed.react('⬅️');
            await queueEmbed.react('➡️');
            await queueEmbed.react('❌');
            const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
            const collector = queueEmbed.createReactionCollector(filter);

            collector.on('collect', async (reaction, user) => {
                if (reaction.emoji.name === '➡️') {
                    if (currentPage < embeds.length-1) {
                      currentPage++;
                      reaction.users.remove(user);
                      queueEmbed.edit(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    } 
                  } else if (reaction.emoji.name === '⬅️') {
                    if (currentPage !== 0) {
                      --currentPage;
                      reaction.users.remove(user);
                      queueEmbed.edit(`Current Page ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    }
                  } else {
                    collector.stop();
                    await queueEmbed.delete();
                  }
            })
            });
            function generateLBembed(lb) {
                const embeds = [];
                let k = 10;
                for(let i =0; i < lb.length; i += 10) {
                    const current = lb.slice(i, k);
                    let j = i;
                    k += 10;
                    // det foroven skærer, så det kun bliver 10 pr. page.
                    const info = current.map(user => `${++j}. ${user.username} - Level ${user.level}, ${user.xp} XP`).join(`\n`)
                    const embed = new Discord.MessageEmbed()
                    .setDescription(`${info}`)
                    .setColor(process.env.COLOR)
                    .setTitle(`Leaderboard for ${client.user.username}`)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png'}));
                    // denne funktion skal skubbe siderne
                    embeds.push(embed)
                }
                return embeds;
            }
        }
        if (args[0] == 'praise') {
            userGlobalSchema.find({
            }).sort({
                praise: -1,
            }).exec((err, res) => {
                if(err) console.log(err);
            
            if (!res) {
                return message.channel.send('Unable to generate leaderboard');
            }
            var page = Math.ceil(res.length / 10)
            
            let embed = new Discord.MessageEmbed();
            embed.setTitle(`Leaderboard for ${client.user.username}`)
            embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png'}))
            embed.setColor(process.env.COLOR);

            let pg = parseInt(args[1]);
            if(pg != Math.floor(pg)) pg = 1;
            if(!pg) pg = 1;
            let end = pg * 10
            let start = (pg * 10) - 10;

            if (res.length === 0) {
                embed.addField('Error', 'No pages found!');
            } else if (res.length <= start) {
                embed.addField('Error', 'Page not found')
            } else if (res.length <= end) {
                embed.setFooter(`Page ${pg} of ${page}`)
                for ( i = start; i < res.length; i++) {
                    embed.addField(`${i + 1}. ${res[i].username}`, `${res[i].praise} Praises`);
                }
            } else {
                embed.setFooter(`Page ${pg} of ${page}`)
                for ( i = start; i < end; i++) {
                    embed.addField(`${i + 1}. ${res[i].username}`, `${res[i].praise} Praises`);
            }
            }
            message.channel.send(embed);
            });
        }
    }
}
