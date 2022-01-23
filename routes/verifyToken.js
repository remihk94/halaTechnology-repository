const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    // check the name of the token and if it is existed
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied!');
    try {
        // if the token existed, then verify the token
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token!');
    }
}