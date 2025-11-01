const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

/**
 * Initialize Socket.io
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${socket.user._id}`);

    // Update user online status
    updateUserStatus(socket.user._id, true);

    // Handle joining conversation rooms
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`📥 ${socket.user.username} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`📤 ${socket.user.username} left conversation ${conversationId}`);
    });

    // Handle typing indicators
    socket.on('typing:start', ({ conversationId, recipientId }) => {
      socket.to(`user:${recipientId}`).emit('typing:start', {
        conversationId,
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    socket.on('typing:stop', ({ conversationId, recipientId }) => {
      socket.to(`user:${recipientId}`).emit('typing:stop', {
        conversationId,
        userId: socket.user._id,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username} (${socket.id})`);
      updateUserStatus(socket.user._id, false);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
};

/**
 * Get Socket.io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Update user online status
 */
const updateUserStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date(),
    });

    // Emit status change to all connected clients
    if (io) {
      io.emit('user:status', {
        userId,
        isOnline,
        lastSeen: new Date(),
      });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

/**
 * Emit new message to conversation participants
 */
const emitNewMessage = (conversationId, message) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit('message:new', message);
  }
};

/**
 * Emit message read event
 */
const emitMessageRead = (conversationId, messageId, userId) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit('message:read', {
      messageId,
      userId,
      readAt: new Date(),
    });
  }
};

/**
 * Emit notification to user
 */
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNewMessage,
  emitMessageRead,
  emitNotification,
};
