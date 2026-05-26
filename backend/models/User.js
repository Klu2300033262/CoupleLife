const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebase_uid: { type: String, required: true, unique: true },
  auth_provider: { type: String, default: 'email' },
  avatar: { type: String },
  location: { type: String, default: '' },
  partner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  couple_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Couple' },
  is_verified: { type: Boolean, default: false },
  online_status: { type: Boolean, default: false },
  last_active: { type: Date, default: Date.now },
  username: { type: String },
  bio: { type: String, default: '' },
  gender: { type: String },
  pronouns: { type: String },
  timezone: { type: String, default: 'UTC' },
  anniversary_date: { type: Date },
  relationship_status: { type: String, default: 'In Love 💕' },
  relationship_story: { type: String, default: '' },
  visibility_settings: {
    anniversary: { type: String, enum: ['Public', 'Partner only', 'Private'], default: 'Public' },
    status: { type: String, enum: ['Public', 'Partner only', 'Private'], default: 'Public' },
    memories: { type: String, enum: ['Public', 'Partner only', 'Private'], default: 'Public' },
    stats: { type: String, enum: ['Public', 'Partner only', 'Private'], default: 'Public' }
  },
  notification_preferences: {
    chat: { type: Boolean, default: true },
    mood: { type: Boolean, default: true },
    diary: { type: Boolean, default: true },
    anniversary: { type: Boolean, default: true },
    couple_activity: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  theme_preference: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  compatibility_score: { type: Number, default: 0 },
  profile_completion: { type: Number, default: 0 },
  current_mood: {
    mood: { type: String, default: null },
    note: { type: String, default: null },
    updated_at: { type: Date, default: null }
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
