// pages/api/socket.js
import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io...');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      // Optional: Configure CORS if needed
      cors: {
        origin: '*',
      },
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join-room', ({ roomName, username }) => {
        socket.join(roomName);
        console.log(`${username} joined room ${roomName}`);
      });

      socket.on('leave-room', ({ roomName, username }) => {
        socket.leave(roomName);
        console.log(`${username} left room ${roomName}`);
      });

      socket.on('send-message', (messageObj) => {
        console.log(`Message from ${messageObj.username} in ${messageObj.roomName}: ${messageObj.message}`);
        // Broadcast to all sockets in the room except the sender
        socket.to(messageObj.roomName).emit('receive-message', messageObj);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  res.end();
}
