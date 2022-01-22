const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication')
const Favorit = require('../models/Favorits')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path')
const transporter = require('../config/nodemailer')
require('dotenv').config();

function saveUser(req, res) {
    let params = req.body;
    const user = new User();
    if (params.username && params.email && params.password) {
        user.username = params.username;
        user.email = params.email;
        user.password = params.password;
        user.tanbatt = 'AMST3ML';
        user.terms = params.conditions;
        user.avatar = null;
        user.confirmedEmail = false

        User.find({
            $or: [{
                    email: user.email.toLowerCase()
                },
                {
                    username: user.username.toLowerCase()
                }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({
                message: 'error a la peticion de usuarios'
            })
            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'El usuario ya esta registrado'
                })
            } else {
                bcrypt.hash(params.password, 10, async (err, hash) => {
                    user.password = hash;

                    user.save(async (err, userSaved) => {
                        if (err) return res.status(500).send({
                            message: 'error al guardar usuario'
                        });
                        if (userSaved) {
                            const token = jwt.sign({
                                _id: userSaved._id
                            }, process.env.TOKEN_SECRET || "Tokenimage");
                            console.log(token)
                            try{
                            const url = `http://localhost:4200/activar-cuenta/${token}`
                            const info = await transporter.sendMail({
                                from: "bibliotecapp@bibliotecapp.com",
                                to: user.email,
                                subject: "Active su cuenta en nuestra web de intercambio de libros",
                                html: `
                              <h1>Bienvenido a nuestra página de viajes</h1>
                              <p>Porfavor, active su cuenta clicando el siguiente link:
                                <a href="${url}">
                                  click aquí para activar tu cuenta
                                </a>
                              </p>
                              `
                            })
                            console.log(info)
                        } catch(e){
                                console.log("Error Occurred", e)
                            };
                            
                            res.json({
                                token: token,
                                user_id: userSaved._id,
                                message: "Usuario regitrsado, confirme su dirección"
                            });;
                        } else {
                            res.status(404).send({
                                message: 'no se ha registrado el usuario'
                            })
                        }
                    });
                })
            }
        });


    } else {
        res.status(200).send({
            message: 'rellena todos los campos'
        })
    }
}

function asjjelnanbbat(req, res) {
    let params = req.body;
    const user = new User();
    if (params.username && params.email && params.password) {
        user.username = params.username;
        user.email = params.email;
        user.password = params.password;
        user.tanbatt = 'ANBBAT_AMKRAN';
        user.terms = params.conditions;
        user.avatar = null;
        user.confirmedEmail = false

        User.find({
            $or: [{
                    email: user.email.toLowerCase()
                },
                {
                    username: user.username.toLowerCase()
                }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({
                message: 'error a la peticion de usuarios'
            })
            if (users && users.length >= 1) {
                return res.status(200).send({
                    message: 'El usuario ya esta registrado'
                })
            } else {
                bcrypt.hash(params.password, 10, (err, hash) => {
                    user.password = hash;

                    user.save((err, userSaved) => {
                        if (err) return res.status(500).send({
                            message: 'error al guardar usuario'
                        });
                        if (userSaved) {
                            const token = jwt.sign({
                                _id: userSaved._id
                            }, process.env.TOKEN_SECRET || "Tokenimage");
                            const url = `http://localhost:4200/activar-cuenta/${token}`
                            transporter.sendMail({
                                from: "bibliotecapp@bibliotecapp.com",
                                to: user.email,
                                subject: "Active su cuenta en nuestra web de intercambio de libros",
                                html: `
                              <h1>Bienvenido a nuestra página de viajes</h1>
                              <p>Porfavor, active su cuenta clicando el siguiente link:
                                <a href="${url}">
                                  click aquí para activar tu cuenta
                                </a>
                              </p>
                              `
                            });
                            res.json({
                                token: token,
                                user_id: userSaved._id,
                                message: "Usuario regitrsado, confirme su dirección"
                            });;
                        } else {
                            res.status(404).send({
                                message: 'no se ha registrado el usuario'
                            })
                        }
                    });
                })
            }
        });


    } else {
        res.status(200).send({
            message: 'rellena todos los campos'
        })
    }
}

function activation(req, res) {
    
        const user_id = req.body.userId
    
        User.findByIdAndUpdate(user_id, {confirmedEmail: true}, {
            new: true
        }, (err, userConfirmed) =>{
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion de confirmar la cuenta'
                })
            }
            if (!userConfirmed) return res.status(404).send({
                message: 'No se ha podido confirmar la cuenta'
            })
           
            
            return res.status(200).send({
                message: 'cuenta confirmada'
            })
        }
        )
}

function login(req, res) {
    const params = req.body;
    const email = params.email;

    const password = params.password;

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) return res.status(500).send({
            message: 'error en la petición'
        });
        //console.log("Error",err)
        if (user) {
            if(user.confirmedEmail === false){
                return res.status(501).send({
                    message: 'tienes que confirmar el email'
                })
            }else if(user.is_eliminated===true){
                return res.status(501).send({
                    message: 'No estás registrado'
                })
            }else{
            
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    user.password = undefined;
                    const token = jwt.sign({
                        _id: user._id
                    }, process.env.TOKEN_SECRET || "Tokenimage", {
                        expiresIn: 60 * 60 * 24
                    });
                    
                    {
                        res.json({
                            token: token,
                            user: user
                        });
                    }

                } else {
                    return res.status(404).send({
                        message: 'no se ha podido identificar'
                    })
                }
            });
        }
        } else {
            return res.status(404).send({
                message: 'El usuario no se ha podido identificar'
            })
        }
    })
}

async function getUser(req, res) {
    
    const user = await User.findById(req.params.id);

    user.password = undefined;
    return res.json(user);
}
async function followThisUser(identity_user_id, user_id) {
    const following = await Follow.findOne({
        "user": identity_user_id,
        "followed": user_id
    }).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    });
    const followed = await Follow.findOne({
        "user": user_id,
        "followed": identity_user_id
    }).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    })
    return {
        following: following,
        followed: followed
    }
}

function getUsers(req, res) {
    let identity_user_id = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page
    }
    const itemsPerPage = 5
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({
            message: 'error en la peticion'
        })
        if (!users) return res.status(404).send({
            message: 'No hay usuarios'
        })
        return res.status(200).send({
            users,
            total,
            page: Math.ceil(total / itemsPerPage)
        })

    })
}


function getCounters(req, res) {
    const userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }
    getFollowCount(userId).then((value) => {
        return res.status(200).send(value);
    });
}
async function getFollowCount(user_id) {
    const following = await Follow.count({
        "user": user_id
    }).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });
    const followed = await Follow.count({
        "followed": user_id
    }).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });
    const publications = await Publication.count({
        "user": user_id
    }).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });
    return {
        following: following,
        followed: followed,
        publications: publications
    }
}

function updateUser(req, res) {
    const userId = req.params.id;
    console.log(req.body)
    const update = req.body;
    delete update.password;
    if (userId != req.body._id) {
        return res.status(500).send({
            message: 'No tienes permiso'
        })
    }
    User.findOne({
        $or: [{
                username: update.username.toLowerCase()
            },
            {
                email: update.email.toLowerCase()
            }
        ]
    }).exec((err, users) => {
        let user_isset = false;
        [users].forEach((user) => {
            if (user && user._id != userId) user_isset = true;
        })
        if (user_isset) return res.status(404).send({
            message: "los datos ya están usados"
        })
        
        User.findByIdAndUpdate(userId, update, {
            new: true
        }, (err, userUpdated) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion'
                })
            }
            
            if (!userUpdated) return res.status(404).send({
                message: 'No se ha podido actualizar'
            })
            userUpdated.password = undefined;
            return res.status(200).send({
                user: userUpdated
            })
        })

    })
}

function uploadAvatar(req, res) {
    const userId = req.params.id;

    if (req.files) {
        const file_path = req.files.avatar.path;
        const file_split = file_path.split('/');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1]

        if (userId != req.user._id) {
            return removeUploadsFiles(res, file_path, 'No tienes permiso')
        }
        if (file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'png' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {
                avatar: file_path
            }, {
                new: true
            }, (err, userUpdated) => {
                if (err) return res.status(500).send({
                    message: 'error en la peticion'
                })
                if (!userUpdated) return res.status(404).send({
                    message: 'No se ha podido actualizar'
                })
                return res.status(200).send({
                    user: userUpdated
                })
            })
        } else {
            return removeUploadsFiles(res, file_path, 'extencion no valida')
        }
    } else {
        return res.status(200).send({
            message: 'no se ha sibodo el avatar'
        })
    }
}

function removeUploadsFiles(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({
            message: message
        })
    })
}

function getAvatarFile(req, res) {
    const avatar_file = req.params.avatarFile;

    const path_file = '../uploads/publications/' + avatar_file;
    
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la imagen del avatar'
            });
        }
    })
}

function recuperatePassword(req, res){
   
    const email = req.query.emailValue;

    User.find({email: email}, async (err, user) => {
        if (err) return res.status(500).send({
            message: 'email erroneo'
        });
        
        if (user.length > 0) {
            
            const token = jwt.sign({
                _id: user._id
            }, process.env.TOKEN_SECRET || "Tokenimage");
            
            try{
                console.log(user)
            const url = `https://www.bibliotecapp.com/edit-password/${token}`
            const info = await transporter.sendMail({
                from: "bibliotecapp@bibliotecapp.com",
                to: user[0].email,
                subject: "Recuperar ls contraseña de la web de intercambio de libros",
                html: `
              <h1>Bienvenido a BibliotecApp</h1>
              <p>Porfavor, recupera tu contraseña clicando el siguiente link:
                <a href="${url}">
                  click aquí para recuperar tu cintraseña
                </a>
              </p>
              `
            })
            console.log(info)
        } catch(e){
            console.log(e)
        };
            res.json({
                message: "Le hemos enviado un email a su correo"
            });
        } else {
            return res.status(404).send({
                message: 'no se ha podido identificar'
            })
        }
    })
}


function editPassword(req, res){
    
    const update = req.body;
    const email = update.email;
    
    User.findOne({
              
                email: update.email.toLowerCase()
            
    }).exec((err, user) => {
       
        bcrypt.hash(update.password, 10, (err, hash) => {
            user.password = hash;
        
        const userId= user._id
        
        User.findByIdAndUpdate(userId, {password: user.password}, {
            new: true
        }, (err, userUpdated) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion'
                })
            }
            
            if (!userUpdated) return res.status(404).send({
                message: 'No se ha podido actualizar'
            })
            
            userUpdated.password = undefined;
            return res.status(200).send({
                user: userUpdated
            })
        })
    })

    })
}
function deleteUser(req, res) {
    const userId = req.params.id;
    
    User.findByIdAndUpdate(userId, {email: "eliminated", is_eliminated: true}, {
        new: true
    }, (err, userDeleted) =>{
        if (err) {
            console.log(err)
            return res.status(500).send({
                message: 'error en la peticion de eliminar la cuenta'
            })
        }
        if (!userDeleted) return res.status(404).send({
            message: 'No se ha podido eliminar la cuenta'
        })
        Publication.updateMany({user: userId}, {contactPhone: 000000000, is_eliminated: true}, {
            new: true
        }, (err, publicationDeleted) => {
            if (err) {
                console.log(err)
                return res.status(500).send({
                    message: 'error en la peticion de eliminar la publicación'
                })
            }
            if (!publicationDeleted) return res.status(404).send({
                message: 'No se ha podido eliminar la punlicación'
            })
            Favorit.find({user: userId}).deleteMany((err) =>{
                if(err) return res.status(500).send({message: 'error de borrar favorito'});
                
            })
            
            
        }
        
        )
        return res.status(200).send({
            message: 'cuenta eliminada'
        })
    }
    )
}
module.exports = {
    saveUser,
    activation,
    login,
    getUser,
    getUsers,
    getCounters,
    updateUser,
    uploadAvatar,
    getAvatarFile,
    recuperatePassword,
    editPassword,
    deleteUser,
    asjjelnanbbat
}