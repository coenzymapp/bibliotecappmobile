const jwt = require('jsonwebtoken')
const moment = require('moment');
require('dotenv').config();
const toufra= process.env.SECRET 
exports.ensureAuth = function(req, res, next){
    
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'la peticion no tiene headers'
        })
    }
    
    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    
    try{    
        var payload = jwt.decode(token, toufra);       
        if(payload.exp<=moment().unix()){
            return res.status(401).send({message: 'token expirado'})

        }
    }catch(ex){
        console.log(ex)
        return res.status(404).send({message: 'token no es valido'})
        
    }
    req.user = payload;
    next();
}