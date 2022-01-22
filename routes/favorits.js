const express = require('express');
const favoritController = require('../controllers/favorits');

const api = express.Router();
const authentication = require('../middleware/autenticated');


api.post('/favorit', authentication.ensureAuth, favoritController.saveFavorit);
api.get('/all-favorits/:page?', authentication.ensureAuth, favoritController.getFavorits);
api.get('/favorits-user/:user/:page?', authentication.ensureAuth, favoritController.getFavoritsUser);
api.get('/favorit-publication-user/:user/:publication', authentication.ensureAuth, favoritController.getFavoritPublicationUser);



module.exports = api;