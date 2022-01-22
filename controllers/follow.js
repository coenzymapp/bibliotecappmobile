const path= require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/user');
const Follow = require('../models/follow');


function saveFollow(req, res){
    const params = req.body;
    const follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored)=>{
        if(err) return res.status(500).send({message: 'error al guardar seguimiento'});
        if(!followStored) return res.status(404).send({message: 'el seguimiento no se ha guardado'});
        return res.status(200).send({follow: followStored});
    })

}
function deleteFollow(req, res){
    const userId = req.user.sub;
    const followId = req.params.id;
    Follow.find({'user': userId, 'followed': followId}).remove(err =>{
        if(err) return res.status(500).send({message: 'error al dejar de seguir'});
        return res.status(200).send({message: 'el follow se ha eliminado'})
    })
}

function getFollowingUsers(req, res){
    const userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    const page = 1;
    if(req.params.page){
        page = req.params.page;
    }else{
        page=req.params.id;
    }
    const itemsPerPage = 4;
    Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follow, total)=>{
        if(err) return res.status(500).send({message: 'error en el servidor'});
        if(!follows) return res.status(404).send({message: 'no estas siguiendo a ningun usuario'})
        followUserIds(req.user.sub).then((value)=>{
            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                follows,
                users_following: value.following,
                users_followed: value.followed,
            })
        })
    })
}

function getFollowedUsers(req, res){
    const userId = req.user.sub;
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }
    const page = 1;
    if(req.params.page){
        page = req.params.page;
    }else{
        page=req.params.id;
    }
    const itemsPerPage = 4;
    Follow.find({followed:userId}).populate('user').paginate(page, itemsPerPage, (err, follow, total)=>{
        if(err) return res.status(500).send({message: 'error en el servidor'});
        if(!follows) return res.status(404).send({message: 'no te sigue ningun usuario'})
        followUserIds(req.user.sub).then((value)=>{
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            follows,
            users_following: value.following,
            users_followed: value.followed,
        })
    })
    })
}

async function followUserIds(userId){
    const following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec((err, follow)=>{
        return follows;
    })
    const followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follow)=>{
        return follows;
    });
    const following_clean = [];
        following.forEach((follow)=>{
            following_clean.push(follow.followed)
        })
    const followed_clean = [];
        followed.forEach((follow)=>{
            followed_clean.push(follow.user)
        })
        
    return {
        following: following_clean,
        followed: followed_clean
    }
}

module.exports={
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}