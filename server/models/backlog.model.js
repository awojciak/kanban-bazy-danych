const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let backlog = new Schema({
    name: String,
    effort: Number,
    description: String,
    sprintForTeam: Schema.Types.ObjectId,
    blocked: Boolean
});

module.exports = mongoose.model('backlog', backlog);