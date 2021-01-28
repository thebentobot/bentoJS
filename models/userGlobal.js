const mongoose = require('mongoose');

const userGlobalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    praise: {
        type: Number,
        default: 0
    },
    praiseDate : Date,
    weather: String,
    horoscope: String,
    lastfm: String,
});

module.exports = mongoose.model('UserGlobal', userGlobalSchema, 'UsersGlobal');