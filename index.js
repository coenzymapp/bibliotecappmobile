'use strict'
const express = require('express')
const app = require('./app');
const startConnection = require('./database');
// const fs = require('fs');
// const https = require('https')
// const http = require('http');
// const portHTTPS = 3500

//Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.coenzym.org/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/www.coenzym.org/fullchain.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/www.coenzym.org/chain.pem', 'utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };
//Starting both http & https servers
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

 async function main(){
    startConnection(),
//    await httpServer.listen(80, () => {
//         console.log('HTTP Server running on port 80');
//     });
    // await httpsServer.listen(443, () => {
    //     console.log('HTTPS Server running on port 3500');
    // });
    await app.listen(app.get('port'))
    console.log('Server on port', app.get('port'))
}
main ();

