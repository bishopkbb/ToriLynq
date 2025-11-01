const express = require('express');
const {
  createStory,
  getStories,
  getStory,
  deleteStory,
  viewStory,
  getStoryViewers,
  getUserStories,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');
const { uploadStory } = require('../config/cloudinary');

const router = express.Router();

// All story routes require authentication
router.use(protect);

// Story CRUD
router.post('/', uploadStory.single('image'), createStory);
router.get('/', getStories);
router.get('/user/:userId', getUserStories);
router.get('/:storyId', getStory);
router.delete('/:storyId', deleteStory);

// Story interactions
router.post('/:storyId/view', viewStory);
router.get('/:storyId/viewers', getStoryViewers);

module.exports = router;
