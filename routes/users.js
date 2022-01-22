const express = require('express');
const multipart = require('connect-multiparty');
const UserController = require('../controllers/users');

const api = express.Router();
const authentication = require('../middleware/autenticated')
const upload = multipart({uploadDir: './uploads/users'});


api.post('/signup', UserController.saveUser);
api.post('/asjjelnanbbat', UserController.asjjelnanbbat);
api.put('/activate-account', authentication.ensureAuth, UserController.activation);
api.post('/login', UserController.login);
api.get('/recuperate-password', UserController.recuperatePassword);
api.put('/edit-password', authentication.ensureAuth, UserController.editPassword);
api.get('/user/:id', authentication.ensureAuth ,UserController.getUser);
api.put('/user/:id', authentication.ensureAuth ,UserController.deleteUser);
api.get('/users/:page?', authentication.ensureAuth ,UserController.getUsers);
api.get('/counters/:id?', authentication.ensureAuth ,UserController.getCounters);
api.put('/update-user/:id', authentication.ensureAuth ,UserController.updateUser);
api.post('/update-avatar/:id', [authentication.ensureAuth, upload] ,UserController.uploadAvatar);
api.get('/avatar/avatarFile', authentication.ensureAuth, UserController.getAvatarFile);

api.get('/verify-token', authentication.ensureAuth, UserController.getAvatarFile);



module.exports = api;