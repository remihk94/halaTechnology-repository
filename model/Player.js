const mongoose = require('mongoose');


const playerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
     },
    defaultPosition : { type : mongoose.Schema.Types.ObjectId , ref: "Position" },
    matches : [{
        type: mongoose.Schema.Types.ObjectId , ref: "Match"
    }]
});


module.exports = mongoose.model('Player', playerSchema);