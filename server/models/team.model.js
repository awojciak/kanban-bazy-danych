const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let team = new Schema({
    name: String,
    members: [Schema.Types.ObjectId],
    sprintsForTeam: [Schema.Types.ObjectId],
}, { collection: 'team' });

module.exports = mongoose.model('team', team, 'team');