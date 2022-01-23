const router = require('express').Router();
const verify = require('./verifyToken');
const Player = require('../model/Player');
const Match = require('../model/Match');
const Position = require('../model/Position');
const PlayerMatch = require('../model/Player_Match');

router.get('/hi', async (req, res) => {
    res.send('Hello World!');
})

// Getting all players (api/api_routes/players)
router.get('/players',verify, async (req, res) => {
    try {
        const players = await Player.find()
        res.json(players)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Getting all positions (api/api_routes/positions)
router.get('/positions',verify, async (req, res) => {
    try {
        const positions = await Position.find()
        res.json(positions)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Getting all matches (api/api_routes/matches)
router.get('/matches',verify, async  (req, res) => {
    try {
        const matches = await Match.find()
        res.json(matches)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Create One Player (api/api_routes/createPlayer)
router.post('/createPlayer',verify, async (req, res) => {

    const player = new Player({
        name : req.body.name,
        defaultPosition : req.body.defaultPosition
    });
    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Create One Position (api/api_routes/createPosition) 
router.post('/createPosition',verify, async (req, res) => {

    const position = new Position({
        name : req.body.name,
    });
    try {
        const newPosition = await position.save();
        res.status(201).json(newPosition)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// Create One Match (api/api_routes/createMatch) 
router.post('/createMatch',verify, async (req, res) => {

    const match = new Match({
        team1name : req.body.team1name,
        team2name : req.body.team2name,
        identification_number : req.body.identification_number
    });
    try {
        const newMatch = await match.save();
        res.status(201).json(newMatch)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Updating One Player (api/api_routes/updatePlayer/id) 
router.patch('/updatePlayer/:id',verify, async (req, res) => {
    try {
        const updatedPlayer = await Player.updateOne({_id : req.params.id}, {$set: req.body});
        res.json(updatedPlayer)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// Updating One Match (api/api_routes/updateMatch/id) 
router.patch('/updateMatch/:id',verify, async (req, res) => {
    try {
        const updatedMatch = await Match.updateOne({_id : req.params.id}, {$set: req.body});
        res.json(updatedMatch)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

// Updating One Position (api/api_routes/updatePosition/id) 
router.patch('/updatePosition/:id',verify, async (req, res) => {
    try {
        const updatedPosition = await Position.updateOne({_id : req.params.id}, {$set: req.body});
        res.json(updatedPosition)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})
 
// Attach player with position and match (api/api_routes/attach)  
router.post('/attach/',verify, async (req, res) => {
    
    const player = await Player.findById(req.body.player_id);
    const match = await Match.findById(req.body.match_id);
    const position = await Position.findById(req.body.position_id); 
   // validation 
    if (player == null) {
        return res.status(404).json({ message: 'Cannot find player id.' })
    }
    if (match == null) {
        return res.status(404).json({ message: 'Cannot find match id.' })
    }
    if (position == null) {
        return res.status(404).json({ message: 'Cannot find position id.' })
    }
    // create new object
    const player_match = new PlayerMatch({
       player_id: req.body.player_id,
       match_id: req.body.match_id,
       position_id: req.body.position_id
    });
    try {
        // add player_id to match.players
         await Match.findByIdAndUpdate(
              req.body.match_id,
              { $push: { players: req.body.player_id } },
              { new: true, useFindAndModify: false }
            );
       
        // add match_id to player.matches
        await Player.findByIdAndUpdate(
            req.body.player_id,
            { $push: { matches: req.body.match_id } },
            { new: true, useFindAndModify: false }
          );

          // save player_match
        const attatchedPlayer = await player_match.save();
        res.status(201).json(attatchedPlayer)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports = router;