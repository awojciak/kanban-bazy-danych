const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let person = new Schema({
    name: String,
    surname: String,
    timePart: {
        type: Number,
        min: 0.0,
        max: 1.0
    }
}, { collection: 'person' });

module.exports = mongoose.model('person', person, 'person');