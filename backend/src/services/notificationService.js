const Notification = require('../models/Notification');
const { emitNotification } = require('../config/socket');

/**
 * Create and emit notification
 */
const createNotification = async (data) => {
  try {
    const { recipient, sender, type, post, comment, story, message } = data;

    // Don't create notification if sender is the same as recipient
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    // Check if similar notification already exists (prevent duplicates)
    const existingNotification = await Notification.findOne({
      recipient,
      sender,
      type,
      post: post || null,
      comment: comment || null,
      createdAt: { $gte: new Date(Date.now() - 60000) }, // Within last minute
    });

    if (existingNotification) {
      return existingNotification;
    }

    // Create notification
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment,
      story,
      message,
    });

    // Populate sender details
    await notification.populate('sender', 'username avatar');

    // Emit real-time notification
    emitNotification(recipient, notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Create follow notification
 */
const notifyFollow = async (followerId, followedId) => {
  return createNotification({
    recipient: followedId,
    sender: followerId,
    type: 'follow',
  });
};

/**
 * Create like notification
 */
const notifyLike = async (likerId, postAuthorId, postId) => {
  return createNotification({
    recipient: postAuthorId,
    sender: likerId,
    type: 'like',
    post: postId,
  });
};

/**
 * Create comment notification
 */
const notifyComment = async (commenterId, postAuthorId, postId, commentId) => {
  return createNotification({
    recipient: postAuthorId,
    sender: commenterId,
    type: 'comment',
    post: postId,
    comment: commentId,
  });
};

/**
 * Create message notification
 */
const notifyMessage = async (senderId, recipientId, messageId) => {
  return createNotification({
    recipient: recipientId,
    sender: senderId,
    type: 'message',
    message: messageId,
  });
};

/**
 * Create story view notification
 */
const notifyStoryView = async (viewerId, storyAuthorId, storyId) => {
  return createNotification({
    recipient: storyAuthorId,
    sender: viewerId,
    type: 'story_view',
    story: storyId,
  });
};

module.exports = {
  createNotification,
  notifyFollow,
  notifyLike,
  notifyComment,
  notifyMessage,
  notifyStoryView,
};
