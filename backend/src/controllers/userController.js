const User = require('../models/User');
const Post = require('../models/Post');
const { notifyFollow } = require('../services/notificationService');

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/:username
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ author: user._id });

    res.status(200).json({
      success: true,
      data: {
        ...user.getPublicProfile(),
        postsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search users
 * @route   GET /api/users/search?q=query
 * @access  Public
 */
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
      ],
    })
      .select('username avatar bio followers following')
      .limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(user => user.getPublicProfile()),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Follow user
 * @route   POST /api/users/:userId/follow
 * @access  Private
 */
const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Can't follow yourself
    if (userToFollow._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    // Check if already following
    if (req.user.following.includes(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    // Add to following
    req.user.following.push(userToFollow._id);
    await req.user.save();

    // Add to followers
    userToFollow.followers.push(req.user._id);
    await userToFollow.save();

    // Create notification
    await notifyFollow(req.user._id, userToFollow._id);

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unfollow user
 * @route   DELETE /api/users/:userId/follow
 * @access  Private
 */
const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if following
    if (!req.user.following.includes(userToUnfollow._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user',
      });
    }

    // Remove from following
    req.user.following = req.user.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    await req.user.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's followers
 * @route   GET /api/users/:userId/followers
 * @access  Public
 */
const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username avatar bio');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      data: user.followers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's following
 * @route   GET /api/users/:userId/following
 * @access  Public
 */
const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username avatar bio');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      data: user.following,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
