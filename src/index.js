const http = require('http');
const app = require('./app');
const { initWebSocket } = require('./config/socket');

const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
