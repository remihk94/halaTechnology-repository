const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// create admin user 
router.post('/register', async (req, res) => {

    //  validate the data before we make a user 
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if the user is already existed in the database 
    const emailexist = await User.findOne({ email: req.body.email });
    if (emailexist) return res.status(400).send('email already existed!');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new system admin user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const newUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }

})

// login user administrator 
router.post('/login',async (req, res) => {
    //  validate the data before we make an admin user 
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

     //checking if email exists
     const user = await User.findOne({ email: req.body.email });
     if (!user) return res.status(400).send('email or password is wrong!');

     // password is correct 
     const validPass = await bcrypt.compare(req.body.password, user.password);
     if (!validPass) return res.status(400).send('Invalid Password!');

     // create and assign a token
     const token = jwt.sign({ _id : user._id}, process.env.TOKEN_SECRET);
     res.header('auth-token', token).send(token);
 
});

module.exports = router;