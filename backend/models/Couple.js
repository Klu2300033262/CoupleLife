const mongoose = require('mongoose');

const CoupleSchema = new mongoose.Schema({
  couple_id: { type: String, required: true, unique: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  couple_key: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  linked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Couple', CoupleSchema);
