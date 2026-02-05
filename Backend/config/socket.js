const { Server } = require('socket.io');

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // In production, replace with your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {

    // Join a specific group room
    socket.on('join-group', (groupId) => {
      socket.join(`group-${groupId}`);
    });

    // Leave a group room
    socket.on('leave-group', (groupId) => {
      socket.leave(`group-${groupId}`);
    });

    socket.on('disconnect', () => {
    });
  });

  return io;
};

module.exports = initializeSocket;
