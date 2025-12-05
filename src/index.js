const http = require('http');
const app = require('./app');
const { initWebSocket } = require('./config/socket');
const { verifyDbConnection } = require('./config/db');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    // Vérifier la connexion à la base de données avant de démarrer le serveur
    await verifyDbConnection();

    // Initialiser WebSocket
    initWebSocket(server);

    // Démarrer le serveur
    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
