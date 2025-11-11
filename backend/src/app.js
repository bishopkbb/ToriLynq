const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite default port
  process.env.CLIENT_URL,
  'https://tori-lynq.vercel.app', // 
  'https://torilynq-git-main-bishopkbb.vercel.app', // Vercel preview URLs
].filter(Boolean); // Remove undefined values

console.log('🌐 Allowed CORS Origins:', allowedOrigins);

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      console.log('✅ Request with no origin allowed');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      // In development, log the rejected origin for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ CORS blocked for origin:', origin);
      }
      callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours - cache preflight requests
};

// Apply middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  contentSecurityPolicy: false, // Disable for API
}));

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ToriLynq API! 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      stories: '/api/stories',
      notifications: '/api/notifications',
      messages: '/api/messages',
    },
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ToriLynq API is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      allowedOrigins: allowedOrigins,
    },
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/stories', require('./routes/story.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api', require('./routes/message.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/users',
      'GET /api/posts',
      'GET /api/stories',
      'GET /api/notifications',
    ],
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  // CORS error handler
  if (err.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      error: 'CORS Error',
      message: err.message,
      hint: 'Make sure your frontend URL is added to the backend CORS allowed origins',
    });
  }

  // Use your existing error handler
  require('./middleware/errorHandler')(err, req, res, next);
});

module.exports = app;