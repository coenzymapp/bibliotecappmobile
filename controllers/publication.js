const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra');
const moment = require('moment');
const mongoosePaginate = require ('mongoose-pagination');
const cloudinary = require('cloudinary').v2

const Publication = require('../models/publication');
const BookProduct = require('../models/bookProduct')
const Favorit = require('../models/Favorits');
const Permission = require('../models/permission');



async function savePublication(req, res){
    const params = req.body;
    console.log("PARAMS", params)
    if(!params.text) return res.status(200).send({message: 'necesitas enviar texto'});
    
    const publication = Publication();
    publication.title = params.title.toLowerCase();
    publication.author = params.author.toLowerCase();
    publication.text = params.text;
    publication.file = "null";
    publication.genre = params.genre;
    publication.language =params.language;
    publication.city = params.city;
    publication.contactPhone = Number(params.contactPhone);
    
    publication.user = req.params.userId;
    publication.is_exchanged = false;
    publication.is_eliminated = false;
    publication.purpose= params.purpose.toLowerCase();
    publication.created_at = moment().unix();
    publication.price = 0;
      

    publication.save((err, publicationSaved)=>{
        
        if(err){
            console.log(err)
            return res.status(500).send({message: 'Error al publicar la publication'})}
        if(!publicationSaved) return res.status(404).send({message: 'la publicacion no ha sido guardada'});
        publication.user.password = undefined;
        
        return res.status(200).send({publication: publicationSaved});
    })
}
///////////////////////////////////////////////
async function saveBookProduct(req, res){
    const params = req.body;
      console.log("PARAMS",params)
    if(!params.text) return res.status(200).send({message: 'necesitas enviar texto'});
    
    const publication = Publication();
    publication.title = params.title.toLowerCase();
    publication.author = params.author.toLowerCase();
    publication.text = params.text;
    publication.file = "null";
    publication.genre = params.genre;
    publication.language =params.language;
    publication.city = params.city;
    publication.contactPhone = Number(params.contactPhone);
    
    publication.user = req.params.userId;
    publication.is_exchanged = false;
    publication.is_eliminated = false;
    publication.purpose= params.purpose;
    publication.created_at = moment().unix();
    publication.price = Number(params.price);
      

    publication.save((err, publicationSaved)=>{
        
        if(err){
            console.log(err)
            return res.status(500).send({message: 'Error al publicar la publication'})}
        if(!publicationSaved) return res.status(404).send({message: 'la publicacion no ha sido guardada'});
        publication.user.password = undefined;
        
        return res.status(200).send({publication: publicationSaved});
    })
}


function getPublications(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    const itemsPerPage = 10;
    const city = req.query.city 
    if(req.query.searchQuery == ''){
        searchQuery = '';
        console.log("console.log(searchQuery)",searchQuery)
    }else {
        searchQuery = req.query.searchQuery.toLowerCase();
        console.log("console.log(searchQuery)",searchQuery)
    }
    
    
    if(city!=='' && searchQuery!=''){
        Publication.find({is_eliminated: false, city: city, title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city=='' && searchQuery!==''){
        
        Publication.find({is_eliminated: false, title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city!='' && searchQuery==''){
        Publication.find({is_eliminated: false, city: city}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else{
        Publication.find({is_eliminated: false}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }
    
}

///////////---------------////////////////////////////////----------
function getDonationBooksList(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    const itemsPerPage = 10;
    const city = req.query.city 
    if(req.query.searchQuery == ''){
        searchQuery = '';
        console.log("console.log(searchQuery)",searchQuery)
    }else {
        searchQuery = req.query.searchQuery.toLowerCase();
        console.log("console.log(searchQuery)",searchQuery)
    }
    
    
    if(city!=='' && searchQuery!=''){
        Publication.find({is_eliminated: false, purpose: 'donation', city: city, title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city=='' && searchQuery!==''){
        
        Publication.find({is_eliminated: false, purpose: 'donation', title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city!='' && searchQuery==''){
        Publication.find({is_eliminated: false, purpose: 'donation', city: city}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else{
        Publication.find({is_eliminated: false, purpose: 'donation'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }
    
}

/////////////////////////////////////////////////////

function getOfferBooksList(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    
    const itemsPerPage = 10;
    //const purpose = req.query.purpose;
    const city = req.query.city 
    if(req.query.searchQuery == ''){
        searchQuery = '';
        console.log("searchQuery",searchQuery)
    }else {
        searchQuery = req.query.searchQuery.toLowerCase();
        console.log("searchQuery",searchQuery)
    }
    
    
    if(city!=='' && searchQuery!=''){
        Publication.find({is_eliminated: false, purpose: 'Oferta', city: city, title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS1",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city=='' && searchQuery!==''){
        
        Publication.find({is_eliminated: false, purpose: 'Oferta', title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS2",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city!='' && searchQuery==''){
        Publication.find({is_eliminated: false, purpose: 'Oferta', city: city}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS3",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else{
        Publication.find({is_eliminated: false, purpose: 'Oferta'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS4",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }
    
}
function getDemandBooksList(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    
    const itemsPerPage = 10;
    const purpose = req.query.purpose;
    const city = req.query.city 
    if(req.query.searchQuery == ''){
        searchQuery = '';
        console.log("searchQuery",searchQuery)
    }else {
        searchQuery = req.query.searchQuery.toLowerCase();
        console.log("searchQuery",searchQuery)
    }
    
    
    if(city!=='' && searchQuery!=''){
        Publication.find({is_eliminated: false, purpose: 'Demanda', city: city, title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS1",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city=='' && searchQuery!==''){
        
        Publication.find({is_eliminated: false, purpose: 'Demanda', title: {$regex : `.*${searchQuery}.*`}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS2",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else if(city!='' && searchQuery==''){
        Publication.find({is_eliminated: false, purpose: 'Demanda', city: city}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS3",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }else{
        Publication.find({is_eliminated: false, purpose: 'Demanda'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            publications.forEach(function(publication){
                publication.user.password = undefined;
            })
            console.log(    "PUBLICATIONS4",publications)
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    }
    
}

//////////////////////////////////////////////////////

function getSellBooks(req, res){
    const page = 1;
    const itemsPerPage = 3;
    Publication.find({is_eliminated: false, purpose: 'Oferta'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
        if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
        publications.forEach(function(publication){
            publication.user.password = undefined;
        })
        
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    })
}

function getDemandBooks(req, res){
    const page = 1;
    const itemsPerPage = 3;
    Publication.find({is_eliminated: false, purpose: 'Demanda'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
        if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
        publications.forEach(function(publication){
            publication.user.password = undefined;
        })
        
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    })
}

function getExchangeBooks(req, res){
    const page = 1;
    const itemsPerPage = 3;
    Publication.find({is_eliminated: false, purpose: 'exchange'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
        if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
        publications.forEach(function(publication){
            publication.user.password = undefined;
        })
        
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    })
}

function getDonationBooks(req, res){
    const page = 1;
    const itemsPerPage = 3;
    Publication.find({is_eliminated: false, purpose: 'donation'}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
        if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
        publications.forEach(function(publication){
            publication.user.password = undefined;
        })
        
        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page: page,
            items_per_page: itemsPerPage,
            publications
        })
    })
}
/////////////////////////////////////////////////


function getPublicationsUser(req, res){
    let page = 1;
    if(req.params.page){
        page= req.params.page;
    }
    let user = req.user.sub;
    if(req.params.user){
        user = req.params.user;
    }
    const itemsPerPage = 4;
    
        Publication.find({user: user, is_eliminated: false}).sort('created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!publications) return res.status(404).send({message: 'no hay publicaciones'});
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                publications
            })
        })
    
}

function getPublication(req, res){
    const publicationId = req.params.id;
    
    Publication.findOne({_id:publicationId, is_eliminated: false}).populate('user','username avatar _id email').exec((err, publication)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicacion'});
        if(!publication) return res.status(404).send({message: 'no hay publicacion'});
        return res.status(200).send({publication});
    })
}
function getHomePublication(req, res){
    const publicationId = req.params.id;
    Publication.findById({_id:publicationId}).populate('user','username avatar _id').exec((err, publication)=>{
        if(err) return res.status(500).send({message: 'error de recibir publicacion'});
        if(!publication) return res.status(404).send({message: 'no hay publicacion'});
        return res.status(200).send({publication:publication});
    })
}


function deletePublication(req, res) {
    const publicationId = req.params.id;
    Publication.findByIdAndUpdate(publicationId, {is_eliminated: true}, {
        new: true
    }, (err, publicationDeleted) =>{
        if (err) {
            console.log(err)
            return res.status(500).send({
                message: 'error en la peticion de eliminar la publicación'
            })
        }
        if (!publicationDeleted) return res.status(404).send({
            message: 'No se ha podido eliminar la punlicación'
        })
        Favorit.find({publication: publicationId}).deleteOne((err) =>{
                    if(err) return res.status(500).send({message: 'error de borrar favorito'});
                    return res.status(200).send({message: 'publicación eliminada'});
                })
        
    }
    )
}

async function uploadAvatar(req, res){
    try{
    const publicationId = req.params.id
   
    if(req.files){
        const file_path=req.files.image.path;
        
        const file_split = file_path.split('\\');
        
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext =ext_split[1]
        
        if(file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif'){
            const result = await cloudinary.uploader.upload(file_path, function(error, result){
                    console.log(error)
                })
            
            Publication.findOne({'user':req.user._id, '_id':publicationId}).exec((err, publication)=>{
                if(publication){
                    Publication.findByIdAndUpdate(publicationId, {file: result.secure_url}, {new:true}, (err, publicationUpdated)=>{
                        if(err) return res.status(500).send({
                            message: 'error en la peticion'
                        })
                        if(!publicationUpdated) return res.status(404).send({
                            message: 'No se ha podido actualizar'
                        })
                        fsx.unlink(file_path);
                        return res.status(200).send({publication: publicationUpdated})
                    })
                }else{
                    return removeUploadsFiles(res, file_path, 'no tienes permiso para actualizar')
                }
            })
        }else{
            return removeUploadsFiles(res, file_path, 'extencion no valida')
        }
    }else{
        return res.status(200).send({message: 'no se ha subido la photo'})
    }
}catch(err){
    console.log(err)
}
}

function removeUploadsFiles(res, file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({message: message})
    })
}

function getAvatarFile(req, res){
    const avatar_file = req.params.avatarFile;
    
    const path_file = '../uploads/publications'+avatar_file;
    fs.exists(path_file, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen del avatar'});
        }
    })
}

function updatePublication(req, res) {
    const publicationId = req.params.id;
    console.log(req.body)
    const updatePublication = req.body;
    updatePublication.purpose = req.body.purpose.toLowerCase();
    updatePublication.title = req.body.title.toLowerCase();
    const userId = req.user._id
 
    if (userId != updatePublication.user._id) {
        return res.status(500).send({
            message: 'No tienes permiso'
        })
    }
    Publication.findOne({
        $or: [{
                _id: updatePublication._id
            },
        ]
    }).exec((err, publications) => {
        let publication_isset = false;
        [publications].forEach((publication) => {
            if (publication && publication.user._id != userId) publication_isset = true;
        })
        if (publication_isset) return res.status(404).send({
            message: "los datos ya están usados"
        })
        Publication.findByIdAndUpdate(publicationId, updatePublication, {
            new: true
        }, (err, publicationUpdated) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion'
                })
            }
    
            if (!publicationUpdated) return res.status(404).send({
                message: 'No se ha podido actualizar'
            })
           
            return res.status(200).send({
                user: publicationUpdated
            })
        })

    })
}

async function savePermission(req, res){
    const params = req.body;
      
    const permission = Permission();
    
    permission.publication = params.publication;
    permission.publisher =params.publisher;
    permission.viewed = false;
    permission.user = params.user;
    permission.status = 'pendent';
    permission.permited_at = null;
    permission.created_at = moment().unix();
    

    permission.save((err, permissionSaved)=>{
        
        permission.user.password = undefined;
        if(err){
            console.log(err)
            return res.status(500).send({message: 'Error al publicar la permission'})}
        if(!permissionSaved) return res.status(404).send({message: 'la publicacion no ha sido guardada'});
        permission.user.password = undefined;
        
        return res.status(200).send({permission: permissionSaved});
    })
}

function getPetitionsUser(req, res){
    let page = 1;
    if(req.params.page){
        page= req.params.page;
    }
    
    let user = req.user._id;
    if(req.params.user){
        user = req.params.id;
    }
    
    const itemsPerPage = 4;
    
        Permission.find({publisher: user, status: "pendent"}).populate('user', '_id username email').paginate(page, itemsPerPage, (err, petitions, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir peticion'});
            if(!petitions) return res.status(404).send({message: 'no hay peticiones'});
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                petitions
            })
        })
    
}
function getAcceptedPetitionsUser(req, res){
    let page = 1;
    if(req.params.page){
        page= req.params.page;
    }
    
    let user = req.user._id;
    if(req.params.user){
        user = req.params.id;
    }
    
    const itemsPerPage = 4;
    
        Permission.find({user: user, status: "accepted", viewed: false}).sort('created_at').populate('publication').paginate(page, itemsPerPage, (err, permissions, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir peticion'});
            if(!permissions) return res.status(404).send({message: 'no hay peticiones'});
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                permissions
            })
        })
    
}

acceptPermission = (req, res)=>{
    const user_id = req.params.id;
    const permission_id = req.params.permission;
    
    Permission.findByIdAndUpdate(permission_id, {status:"accepted"},(err, permission)=>{
        if(err) return res.status(500).send({message: "error en servidor"})
        if(!permission) return res.status(404).send({message: "petición no encontrada"})
        if(permission.publisher!=user_id) return res.status(501).send({message:"no tienes permiso"})
        return res.status(200).send({message:"permiso aceptado"})

    })

}
refusePermission = (req, res)=>{
    const user_id = req.params.id;
    const permission_id = req.params.permission;
    
    Permission.findByIdAndDelete(permission_id,(err, permission)=>{
        if(err) return res.status(500).send({message: "error en servidor"})
        if(!permission) return res.status(404).send({message: "petición no encontrada"})
        if(permission.publisher!=user_id) return res.status(501).send({message:"no tienes permiso"})
        return res.status(200).send({message:"permiso denegado"})

    })
}
getPermissionPublicationUser = (req, res) => {
    
    let user = req.params.id;
   let publication = req.params.publication;
    
        Permission.find({$and:[{user: user}, {publication:publication}]},(err, permission)=>{
            if(err) return res.status(500).send({message: 'error de recibir permiso'});
            if(!permission) return res.status(404).send({message: 'no hay permiso'});
            
            return res.status(200).send({
                permission
            })
        })
}
markPermissionAsViewed = (req, res) => {
    const user_id = req.params.id;
    const permission_id = req.params.permission;
    
    Permission.findByIdAndUpdate(permission_id, {viewed:true},(err, permission)=>{
        if(err) return res.status(500).send({message: "error en servidor"})
        if(!permission) return res.status(404).send({message: "petición no encontrada"})
        if(permission && permission.user!=user_id) return res.status(501).send({message:"no tienes permiso"})
        return res.status(200).send({message:"permiso visto"})

    })
}
module.exports = {
    savePublication,
    saveBookProduct,
    getOfferBooksList,
    getDemandBooksList,
    getSellBooks,
    getDemandBooks,
    getExchangeBooks,
    getDonationBooks,
    getDonationBooksList,
    getPublications,
    getPublicationsUser,
    getPublication,
    getHomePublication,
    deletePublication,
    uploadAvatar,
    getAvatarFile,
    updatePublication,
    savePermission,
    getPetitionsUser,
    acceptPermission,
    refusePermission,
    getAcceptedPetitionsUser,
    getPermissionPublicationUser,
    markPermissionAsViewed
}