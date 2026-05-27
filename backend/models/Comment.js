const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    diary_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Diary',
      required: true,
      index: true
    },
    user_id: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    reactions: {
      type: Map,
      of: String // userId -> reaction emoji
    }
  },
  {
    timestamps: { createdAt: 'created_at' }
  }
);

module.exports = mongoose.model('Comment', commentSchema);
