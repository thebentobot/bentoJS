module.exports = client => {
    console.log('Let\'s get this bread!');
    
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Bannerbot out here',
            type: 'STREAMING',
            url: 'https://www.youtube.com/watch?v=ocRVCN8hz_Q'
        }
    });
}