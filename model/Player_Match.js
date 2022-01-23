const mongoose = require('mongoose');

const player_matchSchema = new mongoose.Schema({
    player_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Player'  },
    match_id:  { type:  mongoose.Schema.Types.ObjectId, ref: 'Match'  },
   position_id: { type:  mongoose.Schema.Types.ObjectId, ref: 'Position'  }
});

module.exports = mongoose.model('Player_Match', player_matchSchema)