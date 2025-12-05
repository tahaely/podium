const WebSocket = require('ws');

let wss;

const initialiserWebSocket = (serveur) => {
    wss = new WebSocket.Server({ server: serveur });

    wss.on('connection', (ws) => {
        console.log('Nouvelle connexion WebSocket');

        ws.on('message', (message) => {
            console.log('reçu: %s', message);
        });

        ws.send(JSON.stringify({ type: 'BIENVENUE', message: 'Connecté au WebSocket de Gamification' }));
    });

    console.log('✅ Serveur WebSocket initialisé');
};

const diffuser = (donnees) => {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(donnees));
        }
    });
};

module.exports = { initialiserWebSocket, diffuser };
