
const moment = require('moment');
const mongoosePaginate = require ('mongoose-pagination');
const Favorit = require('../models/Favorits');

async function saveFavorit(req, res){
    const params = req.body;
      
    if(!params.user) return res.status(200).send({message: 'necesitas registrarte'});
    const favorit = Favorit();
    
    favorit.user = params.user;
    favorit.publication= params.publication;
    favorit.created_at = moment().unix();
    

    favorit.save((err, favoritSaved)=>{
        
        if(err) return res.status(500).send({message: 'Error al añadir a favoritos'})
        if(!favoritSaved) return res.status(404).send({message: 'la publicacion ha sido añadida a tus favoritos'});
        
        
        return res.status(200).send({favorit: favoritSaved});
    })
}

function getFavorits(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    
    const itemsPerPage = 10;
        Favorit.find().sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, favorits, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!favorits) return res.status(404).send({message: 'no hay publicaciones'});
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                favorits
            })
        })

    }

    function getFavoritsUser(req, res){
    let page = 1;
    if(req.params.page){
        page= req.params.page;
    }
    let user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }
    const itemsPerPage = 4;
    
        Favorit.find({user: user}).sort('created_at').populate('publication').paginate(page, itemsPerPage, (err, favorits, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir favoritos'});
            if(!favorits) return res.status(404).send({message: 'no hay favoritos'});
            favorits.forEach(function(favorit){
                favorit.user.password = undefined;
            })
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                favorits
            })
        })
    
}

function getFavoritPublicationUser(req, res){
    
   let user = req.params.user;
   let publication = req.params.publication;
    
    
        Favorit.find({$and:[{user: user}, {publication:publication}]},(err, favorits, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir favoritos'});
            if(!favorits) return res.status(404).send({message: 'no hay favoritos'});
            favorits.forEach(function(favorit){
                favorit.user.password = undefined;
            })
            return res.status(200).send({
                
                favorits
            })
        })
    
}
module.exports = {
    saveFavorit,
    getFavorits,
    getFavoritsUser,
    getFavoritPublicationUser
}