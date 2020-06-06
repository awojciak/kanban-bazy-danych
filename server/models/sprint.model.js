const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sprint = new Schema({
    number: {
        type: Number,
        min: 1,
        unique: 1
    },
    sprintForTeams: [Schema.Types.ObjectId],
    start: Date,
    end: Date
}, { collection: 'sprint' });

module.exports = mongoose.model('sprint', sprint, 'sprint');