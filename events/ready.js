module.exports = client => {
    console.log('Let\'s get this bread!');
    
    client.user.setActivity(`🍱 - Feeding in ${client.channels.cache.size} channels, serving on ${client.guilds.cache.size} servers`, {type: 'PLAYING'});
}
