const jwt = require('jsonwebtoken'); 
require('dotenv').config();

module.exports = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    let token;

    // First condition for general web requests and Postman
    if (authHeader.includes(' ')) {
        token = authHeader && authHeader.split(' ')[1];
    // Second condition specifically for Swagger documentation
    } else {
        token = authHeader;
    }
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log(req.user);
        next();
    })
}
