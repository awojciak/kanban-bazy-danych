const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sprintForTeam = new Schema({
    sprint: Schema.Types.ObjectId,
    team: Schema.Types.ObjectId,
    capacity: Number,
}, { collection: 'sprintForTeam' });

module.exports = mongoose.model('sprintForTeam', sprintForTeam, 'sprintForTeam');