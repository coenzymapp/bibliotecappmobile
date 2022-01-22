const express = require('express');
const messageController = require('../controllers/report');

const api = express.Router();
const authentication = require('../middleware/autenticated');


api.post('/report', authentication.ensureAuth, messageController.saveReport);
api.get('/all-reports/:page?', authentication.ensureAuth, messageController.getReports);
//api.get('/reports-by-user/:id/:page?', authentication.ensureAuth, messageController.getReportByUser);


module.exports = api;