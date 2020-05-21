const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let person = new Schema({
    name: String,
    surname: String,
    timePart: {
        type: Schema.Types.Decimal128,
        min: 0.0,
        max: 1.0
    }
});

module.exports = mongoose.model('person', person);