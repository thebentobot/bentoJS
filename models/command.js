const mongoose = require('mongoose');

const commandSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    messageAuthorId: String,
    authorName: String,
    dateMade: Date,
    command: String,
    content: String
});

module.exports = mongoose.model('command', commandSchema, 'commands');