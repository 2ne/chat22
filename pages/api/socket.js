import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Socket is initializing');
  const io = new Server(res.socket.server, {
    path: '/api/socketio',
  });
  res.socket.server.io = io;

  io.on('connection', socket => {
    console.log('New client connected');
    
    socket.on('send-message', msg => {
      console.log('API route received message:', msg);
      io.emit('receive-message', msg);
      console.log('API route broadcasted message');
    });

    socket.on('user-typing', ({ nickname, isTyping }) => {
      console.log(`${nickname} is ${isTyping ? 'typing' : 'not typing'}`);
      socket.broadcast.emit('user-typing', { nickname, isTyping });
    });
  });

  console.log('Socket is initialized');
  res.end();
};

export default SocketHandler;