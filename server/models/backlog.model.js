const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let backlog = new Schema({
    name: String,
    effort: {
        type: Number,
        min: 0,
    },
    description: String,
    sprintForTeam: Schema.Types.ObjectId,
    blocked: Boolean,
    tags: [String]
}, { collection: 'backlog' });

module.exports = mongoose.model('backlog', backlog, 'backlog');