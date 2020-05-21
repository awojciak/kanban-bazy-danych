const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let task = new Schema({
    name: String,
    plannedTime: {
        type: Schema.Types.Decimal128,
        min: 0,
    },
    spentTime: {
        type: Schema.Types.Decimal128,
        min: 0,
    },
    description: String,
    person: Schema.Types.ObjectId,
    backlog: Schema.Types.ObjectId,
    status: String,
    tags: [String],
    blocked: Boolean
});

module.exports = mongoose.model('task', task);