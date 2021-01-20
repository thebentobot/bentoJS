module.exports = {
    name: 'prune',
    category: 'moderation',
    description: 'Removes messages',
    usage: `prune <1-100>`,
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_MESSAGES'))
            return message.channel.send('You do not have permission to use this command.').then(m => m.delete({timeout: 5000}));
        message.delete()
        const Args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
        const amount = Args.join(' '); // Amount of messages which should be deleted

        if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!').then(m => m.delete({timeout: 5000})); // Checks if the `amount` parameter is given
        if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!').then(m => m.delete({timeout: 5000})); // Checks if the `amount` parameter is a number. If not, the command throws an error

        if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!').then(m => m.delete({timeout: 5000})); // Checks if the `amount` integer is bigger than 100
        if (amount < 1) return message.reply('You have to delete at least 1 message!').then(m => m.delete({timeout: 5000})); // Checks if the `amount` integer is smaller than 1

        await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
            message.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
        )});
    }
}