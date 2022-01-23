const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    identification_number: {
        type: Number,
        required: true
    },
    team1name: {
        type: String,
        required: true
    },
    team2name: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true,
        default: Date.now
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Player"
    }]
});


module.exports = mongoose.model('Match', matchSchema)