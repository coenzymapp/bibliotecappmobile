const express = require('express');
const FollowControllers = require('../controllers/follow');

const api = express.Router();
const authentication = require('../middleware/autenticated')


api.post('/follow', authentication.ensureAuth, FollowControllers.saveFollow);
api.delete('/follow/:id', authentication.ensureAuth, FollowControllers.deleteFollow);
api.get('/following/:id?/:page?', authentication.ensureAuth, FollowControllers.getFollowingUsers);
api.get('/followed/:id?/:page?', authentication.ensureAuth, FollowControllers.getFollowedUsers);




module.exports = api
