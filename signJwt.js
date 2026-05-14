const jwt = require("jsonwebtoken");

const signJwt = (payload) =>{
    return jwt.sign(payload, process.env.jwtSecret, {
        expiresIn: process.env.jwtExpiresIn
    });
}

module.exports = signJwt ;