const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, 'Please provide heading'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  url: {
    type: String,
    required: [true, 'Please provide url'],
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  bookMarked: {
    type: [String],
    default: [],
  },
  liked: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Slide', slideSchema);
