const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let task = new Schema({
    name: String,
    plannedTime: {
        type: Number,
        min: 0,
    },
    spentTime: {
        type: Number,
        min: 0,
    },
    description: String,
    person: Schema.Types.ObjectId,
    backlog: Schema.Types.ObjectId,
    status: String,
    tags: [String],
    blocked: Boolean
}, { collection: 'task' });

module.exports = mongoose.model('task', task, 'task');