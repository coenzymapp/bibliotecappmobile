const nodemailer = require( 'nodemailer' )
require('dotenv').config();
let transporter = nodemailer.createTransport( {
        //service: 'Gmail',
        host: 'mail.privateemail.com',
        port: 587,
        secure: false,    
        auth: {
                user: process.env['TABRAT'],
                pass: process.env['AWALNTOUFRA']
        }
} )
module.exports = transporter;