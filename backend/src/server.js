const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB
connectDB();

// Start server
server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║                                        ║
  ║   🎉 ToriLynq API Server Started!     ║
  ║                                        ║
  ║   Environment: ${NODE_ENV.padEnd(24)}║
  ║   Port:        ${PORT.toString().padEnd(24)}║
  ║   URL:         http://localhost:${PORT.toString().padEnd(6)}║
  ║                                        ║
  ║   Health Check: /api/health            ║
  ║   Socket.io:    ✅ Enabled              ║
  ║                                        ║
  ╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
