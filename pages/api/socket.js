import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

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

  console.log('Socket is initialized');
  res.end();
};

export default SocketHandler;