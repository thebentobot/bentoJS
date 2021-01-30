const userGlobalSchema = require('../../models/userGlobal');
const moment = require('moment');

function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
  
    return {
      total,
      days,
      hours,
      minutes,
      seconds
    };
  }

module.exports = {
    name: 'praise',
    aliases: ['pr'],
    category: 'fun features',
    description: 'Praise your friends :D. Use without argument to see timer',
    usage: `praise [<user>]`,
    run: async (client, message, args) => {

        if (!args[0]) {
            const authorId = message.author.id
            const now = new Date()
            const authorData = await userGlobalSchema.findOne({
                userID: authorId
            })
            const then = new Date(authorData.praiseDate)

            const diff = now.getTime() - then.getTime()
            const diffHours = Math.round(diff / (1000 * 60 * 60))

            const hours = 24
        if (authorData && authorData.praiseDate) {
            if (diffHours <= hours) {
                return message.channel.send(`${message.author.username}, you can praise someone again in ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).hours} hours, ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).minutes} minutes and ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).seconds} seconds`);
            }
            if (diffHours >= hours) {
                return message.channel.send(`You did not specify a user!`);
            }
        }
        if (!authorData.praiseDate) {
            return message.channel.send(`${message.author.username} You haven't praised anyone before. Please praise an user, it's good for you.`)
        }
    }        
        try {
            const target = message.mentions.users.first() || await message.guild.members.fetch(args[0])

        const { guild } = message
        const targetId = target.id || target
        const authorId = message.author.id
        const now = new Date()

        if (targetId === authorId) {
            return message.channel.send(`You can't praise yourself`)
        }

        const authorData = await userGlobalSchema.findOne({
            userID: authorId
        })
        const then = new Date(authorData.praiseDate)

        const diff = now.getTime() - then.getTime()
        const diffHours = Math.round(diff / (1000 * 60 * 60))

        const hours = 24
        if (authorData && authorData.praiseDate) {
            if (diffHours <= hours) {
                return message.channel.send(`${message.author.username}, you can praise someone again in ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).hours} hours, ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).minutes} minutes and ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).seconds} seconds`);
            }
            if (!args.length && diffHours >= hours) {
                return message.channel.send(`You did not specify a user!`)
            }
        }

        // updating the date property for the command sender
        await userGlobalSchema.findOneAndUpdate({
            userID: authorId
        }, {
            userID: authorId,
            praiseDate: now
        }, {
            upsert: true
        })

        // increase how many thanks the target user has had

        const result = await userGlobalSchema.findOneAndUpdate({
            userID: targetId
        }, {
            userID: targetId,
            $inc: {
                praise: 1
            }  
        }, {
            upsert: true,
            new: true
        })

        const amount = result.praise
        return message.channel.send(`${message.author.username} you have praised <@${targetId}>! \n <@${targetId}> has been praised ${amount} times, blessed\nYou can praise someone again in 24 hours.`)
    } catch {
        return message.channel.send(`Your input was invalid. Please specify a user.`)
    }
    }
}