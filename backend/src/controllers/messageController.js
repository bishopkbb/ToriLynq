const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { emitNewMessage, emitMessageRead } = require('../config/socket');

/**
 * @desc    Get or create conversation
 * @route   POST /api/conversations
 * @access  Private
 */
const getOrCreateConversation = async (req, res, next) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required',
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Can't create conversation with yourself
    if (participantId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself',
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
      isGroup: false,
    })
      .populate('participants', 'username avatar isOnline lastSeen')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      });

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, participantId],
        isGroup: false,
      });

      await conversation.populate('participants', 'username avatar isOnline lastSeen');
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's conversations
 * @route   GET /api/conversations
 * @access  Private
 */
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'username avatar isOnline lastSeen')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get conversation messages
 * @route   GET /api/conversations/:conversationId/messages
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation',
      });
    }

    // Get messages
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Message.countDocuments({ conversation: conversationId });

    res.status(200).json({
      success: true,
      count: messages.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
      },
      data: messages.reverse(), // Return in chronological order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required',
      });
    }

    // Check if user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation',
      });
    }

    // Handle media upload if present
    const media = req.file ? req.file.path : null;
    const mediaType = req.file ? getMediaType(req.file.mimetype) : null;

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content: content || '',
      media,
      mediaType,
    });

    await message.populate('sender', 'username avatar');

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Emit real-time message to conversation participants
    emitNewMessage(conversationId, message);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark message as read
 * @route   PATCH /api/messages/:messageId/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only recipient can mark as read
    if (message.sender.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark own message as read',
      });
    }

    // Mark as read
    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();

      // Emit read event
      emitMessageRead(message.conversation, message._id, req.user._id);
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to determine media type from mimetype
 */
const getMediaType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};
