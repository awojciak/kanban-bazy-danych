const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let team = new Schema({
    name: String,
    members: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('team', team);