const express = require('express');
const PublicationController = require('../controllers/publication');
const api = express.Router();
const authentication = require('../middleware/autenticated');

const multipart = require('connect-multiparty');
const upload = multipart({uploadDir: './uploads/publications'});


api.post('/publication/:userId', authentication.ensureAuth, PublicationController.savePublication);

api.post('/bookproduct-publish/:userId', authentication.ensureAuth, PublicationController.saveBookProduct);
api.get('/home-sell-books/', PublicationController.getSellBooks);
api.get('/home-demand-books/', PublicationController.getDemandBooks);
api.get('/home-exchange-books/', PublicationController.getExchangeBooks);
api.get('/home-donation-books/', PublicationController.getDonationBooks);
api.get('/offer-books/:page?', PublicationController.getOfferBooksList);
api.get('/donation-books/:page?', PublicationController.getDonationBooksList);
api.get('/demand-books/:page?', PublicationController.getDemandBooksList);

api.put('/update-publication/:id', authentication.ensureAuth, PublicationController.updatePublication);
api.get('/publications/:page?', PublicationController.getPublications);
api.get('/home-publications/:page?', PublicationController.getPublications);
api.get('/publications-user/:user/:page?', authentication.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', PublicationController.getPublication);
api.put('/publication/:id?', authentication.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [authentication.ensureAuth, upload] ,PublicationController.uploadAvatar);
api.get('/pub-image', authentication.ensureAuth, PublicationController.getAvatarFile);

api.post('/permission', authentication.ensureAuth, PublicationController.savePermission);
api.get('/permissions-user/:id', authentication.ensureAuth, PublicationController.getPetitionsUser);
api.get('/accepted-petitions-user/:id', authentication.ensureAuth, PublicationController.getAcceptedPetitionsUser);
api.get('/permission-publication-user/:id/:publication', authentication.ensureAuth, PublicationController.getPermissionPublicationUser);
api.put('/accept-permission/:id/:permission', authentication.ensureAuth, PublicationController.acceptPermission);
api.delete('/refuse-permission/:id/:permission', authentication.ensureAuth, PublicationController.refusePermission);
api.put('/mark-viewed-permission/:id/:permission', authentication.ensureAuth, PublicationController.markPermissionAsViewed);

module.exports = api;