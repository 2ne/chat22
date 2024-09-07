import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://chat22-three.vercel.app",
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