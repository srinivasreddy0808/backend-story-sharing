const mongoose = require('mongoose');
const storySchema = new mongoose.Schema({
  slides: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slide',
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: {
    type: String,
    enum: ['Medical', 'Fruits', 'World', 'India', 'Sports', 'Technology'],
    required: [true, 'Please provide category'],
  },
});

module.exports = mongoose.model('Story', storySchema);
