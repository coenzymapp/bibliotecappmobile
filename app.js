const express = require('express');
let bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cloudinary = require('cloudinary').v2
require('dotenv').config();
const apikey= process.env['CLOUDINARY_API_KEY'];

cloudinary.config({
	cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
	api_key: process.env['CLOUDINARY_API_KEY'],
	api_secret: process.env['CLOUDINARY_API_SECRET'],
});

const app = express();
const user_routes = require('./routes/users')
const follow_routes = require('./routes/follow');
const publication_routes = require('./routes/publication');
const report_routes = require('./routes/report');
const favorit_routes = require('./routes/favorits');

//settings
app.set('port', process.env.PORT || 3000);

//CORS
app.use(express.json());
app.use(cors());

//routes
//app.use('/', express.static('dist/frontend', {redirect:false}));
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', report_routes);
app.use('/api', favorit_routes);

// app.get('*', function(req, res, next){
// 	res.sendFile(path.resolve('index.html'))
// })
app.use('/uploads', express.static(path.resolve('uploads')));



module.exports = app;