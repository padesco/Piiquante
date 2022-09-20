// importer le package HTTP natif de node.js
const http = require('http');
// importer notre application
const app = require('./app');

// importer le package pour utiliser les variables d'environnement
const dotenv = require("dotenv");
const result = dotenv.config();

// la fonction "normalizePort" renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT);
app.set('port', port);

// la fonction "errorHandler" recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};
// créer un serveur avec une fonction qui sera exécutée à chaque appel effectué vers ce serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// on utilise "listen" pour écouter le PORT qui nous interesse sauf si il est déjà utilisé alors on utilise la variable environnement
server.listen(port);