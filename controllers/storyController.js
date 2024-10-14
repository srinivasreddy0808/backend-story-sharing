const Story = require('../models/storyModel');
const Slide = require('../models/slideModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllStories = catchAsync(async (req, res, next) => {
  // Get the user ID from the protect middleware
  const userId = req.user._id;

  const stories = await Story.find({ user: userId })
    .populate('slides')
    .populate('user', 'userName');

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: {
      stories,
    },
  });
});

exports.createStory = catchAsync(async (req, res, next) => {
  const { slides, category } = req.body;
  const userId = req.user._id; // Get user ID from protect middleware

  // Create slides first
  const createdSlides = await Slide.create(slides);

  // Create story with slide IDs
  const story = await Story.create({
    slides: createdSlides.map((slide) => slide._id),
    user: userId,
    category,
  });

  res.status(201).json({
    status: 'success',
    data: {
      story,
    },
  });
});

// Express Route Handler
exports.updateStory = catchAsync(async (req, res, next) => {
  const { storyId } = req.params;
  const updatedStoryData = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const story = await Story.findById(storyId).session(session);
    if (!story) {
      await session.abortTransaction();
      return next(
        new AppError(
          'Story not found or you do not have permission to update it',
          404
        )
      );
    }

    // Delete existing slides
    await Slide.deleteMany({ _id: { $in: story.slides } }).session(session);

    // Create new slides
    const newSlides = await Slide.create(updatedStoryData.slides, { session });
    const newSlideIds = newSlides.map((slide) => slide._id);

    // Update story
    story.slides = newSlideIds;
    story.category = updatedStoryData.category;
    await story.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      data: {
        story: story,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    await session.endSession();
  }
});

exports.getStoriesByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const stories = await Story.find({ category: categoryId })
    .populate('slides')
    .populate('user', 'userName');

  if (stories.length === 0) {
    return next(new AppError('No stories found for this category', 404));
  }

  res.status(200).json({
    status: 'success',
    results: stories.length,
    data: {
      stories,
    },
  });
});

exports.updateSlide = catchAsync(async (req, res, next) => {
  const { storyId, slideId } = req.params;
  const updateData = req.body;

  // Check if the story belongs to the user and includes the slide
  const story = await Story.findOne({ _id: storyId });
  if (!story) {
    return next(
      new AppError(
        'Story not found or you do not have permission to update it',
        404
      )
    );
  }

  if (!story.slides.includes(slideId)) {
    return next(new AppError('Slide not found in this story', 404));
  }

  // Update the slide with the data from the request body
  const updatedSlide = await Slide.findByIdAndUpdate(
    slideId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedSlide) {
    return next(new AppError('Slide not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      slide: updatedSlide,
    },
  });
});

exports.getStoryById = catchAsync(async (req, res, next) => {
  const { storyId } = req.params;

  // Check if the story belongs to the user
  const story = await Story.findOne({ _id: storyId }).populate('slides');
  if (!story) {
    return next(
      new AppError(
        'Story not found or you do not have permission to view it',
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      story,
    },
  });
});
