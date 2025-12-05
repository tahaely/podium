const http = require('http');
const app = require('./app');
const { initialiserWebSocket } = require('./config/socket');

const serveur = http.createServer(app);

// Initialiser WebSocket
initialiserWebSocket(serveur);

const PORT = process.env.PORT || 5000;

serveur.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});
