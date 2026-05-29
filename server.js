const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

// Shared state — three variables now
let state = {
  rpm: 200,         // 0-600
  viscosity: 1.0,   // 0.5-10 cP
  aeration: 0.5,    // 0-2 vvm
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify(state));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      state = { ...state, ...data };
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(state));
        }
      });
    } catch (e) {
      console.error('Bad message:', e);
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Controls:  http://localhost:${PORT}/controls.html`);
  console.log(`Reactor:   http://localhost:${PORT}/reactor.html`);
});