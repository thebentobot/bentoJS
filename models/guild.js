const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    prefix: String,
    logChannelID: String,
    NSFW: {type: String, enum: ['enable', 'disable']},
    welcomeEnable: {type: String, enum: ['enable', 'disable']},
    welcomeMsg: String,
    tiktok: {type: String, enum: ['enable', 'disable']},
    instagram: {type: String, enum: ['enable', 'disable']},
    MsgLogChannelID: String,
    welcomeChannel: String,
    muteRole: String,
    autoRole: String,
    byeEnable: String,
    byeMsg: String,
    byeChannel: String,
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');