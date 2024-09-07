const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send-message', (msg) => {
    console.log('Server received message:', msg);
    io.emit('receive-message', msg);
    console.log('Server emitted message to all clients');
  });

  socket.on('user-typing', ({ nickname, isTyping }) => {
    console.log(`${nickname} is ${isTyping ? 'typing' : 'not typing'}`);
    socket.broadcast.emit('user-typing', { nickname, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});