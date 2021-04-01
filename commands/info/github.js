

module.exports = {
    name: 'github',
    aliases: [],
    category: 'info',
    description: 'Sends the link for the github of Bento 🍱',
    usage: `github`,
    run: async (client, message, args) => {
        return message.channel.send('https://github.com/banner4422/bento')
    }
}