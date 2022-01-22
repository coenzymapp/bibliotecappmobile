const path = require('path');

const moment = require('moment');
const mongoosePaginate = require ('mongoose-pagination');


const Publication = require('../models/publication');
const User = require('../models/user');
const Permission = require('../models/permission');


async function savePermission(req, res){
    const params = req.body;
      
    if(!params.user) return res.status(200).send({message: 'necesitas registrarte'});
    const permission = Permission();
    permission.is_permited = false;
    permission.user = params.user;
    permission.publication= params.publication;
    permission.created_at = moment().unix();
    permission.permited_at = null;
    permission.viewed = false;
    permission.publisher = params.publisher

    permission.save((err, permissionSaved)=>{
        
        if(err) return res.status(500).send({message: 'Error al añadir a permissionos'})
        if(!permissionSaved) return res.status(404).send({message: 'la publicacion ha sido añadida a tus permissionos'});
        
        
        return res.status(200).send({permission: permissionSaved});
    })
}