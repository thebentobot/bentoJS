const mongoose = require('mongoose');

const userServerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    userID: String,
    username: String,
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    muteCount: Number,
    warnCount: Number,
    kickCount: Number,
    banCount: Number
});

module.exports = mongoose.model('UserServer', userServerSchema, 'UsersServers');