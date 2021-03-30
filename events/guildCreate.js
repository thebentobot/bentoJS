const mongoose = require('mongoose');
const Guild = require('../models/guild');

module.exports = async (client, guild) => {
    guild = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildName: guild.name,
        prefix: process.env.PREFIX,
        NSFW: 'disable',
        welcomeEnable: 'disable',
        welcomeMsg: '',
        tiktok: 'enable',
        instagram: 'enable',
    });

    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));

    console.log('I have joined a new server!');
};