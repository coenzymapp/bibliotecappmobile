const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

exports.createToken = function(user){
    const payload = {
        sub: user_id,
        username: user.username,
        email: user.email,
        role: user.tanbatt,
        avatar: user.avatar,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    return jwt.encode(payload, process.env.SECRET);
}