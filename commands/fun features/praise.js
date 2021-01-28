const userGlobalSchema = require('../../models/userGlobal');
const moment = require('moment');

module.exports = {
    name: 'praise',
    aliases: ['pr'],
    category: 'fun features',
    description: 'Praise your friends :D',
    usage: `praise <user>`,
    run: async (client, message, args) => {
        try {
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
        let userID = args[0]
        const target = message.mentions.users.first() || await message.guild.members.fetch(userID)
        if (!target) {
            return message.channel.send(`You did not specify a user!`)
        }

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

        if (authorData && authorData.praiseDate) {
            const then = new Date(authorData.praiseDate)

            const diff = now.getTime() - then.getTime()
            const diffHours = Math.round(diff / (1000 * 60 * 60))

            const hours = 24
            if (diffHours <= hours) {
                return message.channel.send(`${message.author.username} you have already praised someone within the last ${hours} hours.\nYou can praise someone again in ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).hours} hours, ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).minutes} minutes and ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).seconds} seconds`);
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
        return message.channel.send(`${message.author.username} you have praised <@${targetId}>! \n <@${targetId}> has been praised ${amount} times, blessed\nYou can praise someone again in ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).hours} hours, ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).minutes} minutes and ${getTimeRemaining(moment(authorData.praiseDate).add(1, 'day')).seconds} seconds`)
    } catch (err) {
        return message.channel.send(`Your input was invalid. Please specify a user.`)
    }
    }
}