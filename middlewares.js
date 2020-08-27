const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.signedCookies.ujtk;
    if (token){
        jwt.verify(token, process.env.JSON_SECRET, (error, user) =>{
            if(user){
                req.user =  user;
            }
        });
    } 
    next();
}

module.exports = {
    verifyToken,
};