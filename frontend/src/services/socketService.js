import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('conversation:join', conversationId);
    }
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('conversation:leave', conversationId);
    }
  }

  // Send typing indicator
  startTyping(conversationId, recipientId) {
    if (this.socket) {
      this.socket.emit('typing:start', { conversationId, recipientId });
    }
  }

  stopTyping(conversationId, recipientId) {
    if (this.socket) {
      this.socket.emit('typing:stop', { conversationId, recipientId });
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('message:new', callback);
      this.listeners.set('message:new', callback);
    }
  }

  // Listen for message read
  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on('message:read', callback);
      this.listeners.set('message:read', callback);
    }
  }

  // Listen for typing indicators
  onTypingStart(callback) {
    if (this.socket) {
      this.socket.on('typing:start', callback);
      this.listeners.set('typing:start', callback);
    }
  }

  onTypingStop(callback) {
    if (this.socket) {
      this.socket.on('typing:stop', callback);
      this.listeners.set('typing:stop', callback);
    }
  }

  // Listen for user status
  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user:status', callback);
      this.listeners.set('user:status', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
