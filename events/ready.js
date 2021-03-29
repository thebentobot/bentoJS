module.exports = client => {
    console.log('Let\'s get this bread!');
    
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Here to feed you 🍱',
            type: 'STREAMING',
            url: 'https://github.com/banner4422/bento'
        }
    });
}