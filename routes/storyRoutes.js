const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, storyController.getAllStories);
router
  .post('/story', authController.protect, storyController.createStory)
  .get('/story/:categoryId', storyController.getStoriesByCategory);
router.get('/:storyId', storyController.getStoryById);

router.patch('/story/:storyId/slide/:slideId', storyController.updateSlide);

module.exports = router;
