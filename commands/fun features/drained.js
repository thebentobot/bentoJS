module.exports = {
    name: 'drained',
    category: 'fun features',
    description: 'The drain command, only for drainers',
    usage: `drained`,
    run: async (client, message, args) => {
        const user = '232584569289703424' || '123182368184991747' || '200435333198774273' || '145710786206105610' || '94540223051993088' || '321535048002306049' || '229341113503318018' || '192789985353531392'
        if(message.author.id === user)  {
            return message.channel.send('https://www.youtube.com/watch?v=vcAp4nmTZCA')
        } else {
            return message.channel.send('***YOU ARE NOT DRAINED***')
        }
    }
}