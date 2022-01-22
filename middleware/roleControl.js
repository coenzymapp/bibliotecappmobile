
require('dotenv').config();
const toufra= process.env.SECRET 
exports.ensureRole = function(req, res, next){
    
    next();
}