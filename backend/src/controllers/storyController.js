const Story = require('../models/Story');
const User = require('../models/User');

/**
 * @desc    Create new story
 * @route   POST /api/stories
 * @access  Private
 */
const createStory = async (req, res, next) => {
  try {
    const { caption } = req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Story image is required',
      });
    }

    const story = await Story.create({
      author: req.user._id,
      image: req.file.path, // Cloudinary URL
      caption: caption || '',
    });

    await story.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active stories from followed users
 * @route   GET /api/stories
 * @access  Private
 */
const getStories = async (req, res, next) => {
  try {
    // Get stories from followed users + own stories
    const stories = await Story.find({
      author: { $in: [...req.user.following, req.user._id] },
      expiresAt: { $gt: new Date() }, // Only non-expired stories
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    // Group stories by author
    const groupedStories = {};
    stories.forEach(story => {
      const authorId = story.author._id.toString();
      if (!groupedStories[authorId]) {
        groupedStories[authorId] = {
          author: story.author,
          stories: [],
        };
      }
      groupedStories[authorId].stories.push(story);
    });

    // Convert to array
    const storiesArray = Object.values(groupedStories);

    res.status(200).json({
      success: true,
      count: storiesArray.length,
      data: storiesArray,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single story
 * @route   GET /api/stories/:storyId
 * @access  Private
 */
const getStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('author', 'username avatar bio');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if story has expired
    if (story.isExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Story has expired',
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own story
 * @route   DELETE /api/stories/:storyId
 * @access  Private
 */
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check ownership
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story',
      });
    }

    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark story as viewed
 * @route   POST /api/stories/:storyId/view
 * @access  Private
 */
const viewStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if story has expired
    if (story.isExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Story has expired',
      });
    }

    // Don't add author to viewers
    if (story.author.toString() === req.user._id.toString()) {
      return res.status(200).json({
        success: true,
        message: 'Cannot view own story',
      });
    }

    // Check if already viewed
    if (!story.hasViewed(req.user._id)) {
      story.viewers.push(req.user._id);
      await story.save();

      // TODO: Create notification for story author (Phase 2)
    }

    res.status(200).json({
      success: true,
      message: 'Story viewed',
      viewersCount: story.viewers.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get story viewers
 * @route   GET /api/stories/:storyId/viewers
 * @access  Private (only story author)
 */
const getStoryViewers = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .populate('viewers', 'username avatar');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Only author can see viewers
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view story viewers',
      });
    }

    res.status(200).json({
      success: true,
      count: story.viewers.length,
      data: story.viewers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's active stories
 * @route   GET /api/stories/user/:userId
 * @access  Private
 */
const getUserStories = async (req, res, next) => {
  try {
    const stories = await Story.find({
      author: req.params.userId,
      expiresAt: { $gt: new Date() },
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStory,
  getStories,
  getStory,
  deleteStory,
  viewStory,
  getStoryViewers,
  getUserStories,
};
