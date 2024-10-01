const Slide = require('../models/slideModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getBookmarks = catchAsync(async (req, res, next) => {
  // Get the user ID from the request object (set by the protect middleware)
  const userId = req.user._id;

  // Find all slides where the userId is in the bookMarked array
  const bookmarkedSlides = await Slide.find({ bookMarked: userId });

  // If no bookmarks are found, send an appropriate response
  if (bookmarkedSlides.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'No bookmarks found for this user.',
      data: [],
    });
  }

  // Send the response with the bookmarked slides
  res.status(200).json({
    status: 'success',
    results: bookmarkedSlides.length,
    data: bookmarkedSlides,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
