const WebSocket = require('ws');

let wss;

const initWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');

        ws.on('message', (message) => {
            console.log('received: %s', message);
        });

        ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to Gamification WebSocket' }));
    });

    console.log('✅ WebSocket Server initialized');
};

const broadcast = (data) => {
    if (!wss) return;
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = { initWebSocket, broadcast };
