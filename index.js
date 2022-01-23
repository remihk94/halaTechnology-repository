const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
// Import Routes 
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api_routes');
// Import models 
const Position = require('./model/Position')


dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT,() => { console.log('Connected to DB'); });

//Middleware 
app.use(express.json());

// Seed DB with positions 
const seedPositions = [ { name : "offensive"} , { name : "defensive"} , { name : "midfielder"} 
, { name : "right winger"} , { name : "left winger"} , { name : "goal keeper"}]
const seedDB = async () => {
    await Position.deleteMany();
    await Position.insertMany(seedPositions);
};
 
seedDB();

// Routes Middleware
app.use('/api/user' , authRoute);
app.use('/api/api_routes' , apiRoute);

app.listen(5000 , () => { console.log('Server is Running'); })