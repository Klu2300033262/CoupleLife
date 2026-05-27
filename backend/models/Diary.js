const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true
    },
    couple_id: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      default: 'Untitled Memory'
    },
    content: {
      type: String, // Storing TipTap HTML or JSON as string
      default: ''
    },
    visibility: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private'
    },
    images: [{
      type: String // URL of the image
    }],
    emojis: [{
      type: String
    }],
    mood: {
      type: String,
      enum: ['Happy', 'Romantic', 'Sad', 'Angry', 'Excited', 'Missing you', 'Grateful', 'None'],
      default: 'None'
    },
    tags: [{
      type: String
    }],
    reactions: {
      type: Map,
      of: String // userId -> reaction emoji
    },
    pinned: {
      type: Boolean,
      default: false
    },
    draft_saved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

module.exports = mongoose.model('Diary', diarySchema);
