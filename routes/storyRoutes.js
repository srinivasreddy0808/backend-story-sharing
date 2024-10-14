const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, storyController.getAllStories);
router
  .route('/story')
  .post(authController.protect, storyController.createStory);
router
  .route('/story/:storyId')
  .put(authController.protect, storyController.updateStory);
router.route('/story/:categoryId').get(storyController.getStoriesByCategory);
router.route('/:storyId').get(storyController.getStoryById);

router
  .route('/story/:storyId/slide/:slideId')
  .patch(storyController.updateSlide);

module.exports = router;
