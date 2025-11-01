const express = require('express');
const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

// Simple multer config for message media (will use Cloudinary in production)
const upload = multer({ dest: 'uploads/' });

// All message routes require authentication
router.use(protect);

// Conversation routes
router.post('/conversations', getOrCreateConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);

// Message routes
router.post('/messages', upload.single('media'), sendMessage);
router.patch('/messages/:messageId/read', markAsRead);

module.exports = router;
