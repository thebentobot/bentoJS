module.exports = {
    name: 'drained',
    category: 'fun features',
    description: 'The drain command, only for drainers',
    usage: `drained`,
    run: async (client, message, args) => {
        if(message.author.id === '232584569289703424' || message.author.id === '123182368184991747' || message.author.id === '200435333198774273' || message.author.id === '145710786206105610' || message.author.id === '94540223051993088' || message.author.id === '321535048002306049' || message.author.id === '229341113503318018' || message.author.id === '192789985353531392') {
            return message.channel.send('https://www.youtube.com/watch?v=vcAp4nmTZCA')
        } else {
            return message.channel.send('***YOU ARE NOT DRAINED***')
        }
    }
}