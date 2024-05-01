const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req:any, res:any) => {
  res.send('<H1>HELLO WOLRD</H1>');
});

io.on('connection', (socket:any) => {
  console.log('A new client connected!');

  socket.on('message', (message:any) => {
    console.log('Received: %s', message);
    io.emit('message', message); // Send message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started...');
});
