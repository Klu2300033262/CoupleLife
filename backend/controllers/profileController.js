const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebase_uid: req.user.firebase_uid || req.user.uid }).populate('partner_id');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, gender, pronouns, timezone, relationship_status, relationship_story, avatar, anniversary_date } = req.body;
    const user = await User.findOne({ firebase_uid: req.user.firebase_uid || req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;
    if (pronouns !== undefined) user.pronouns = pronouns;
    if (timezone !== undefined) user.timezone = timezone;
    if (relationship_status !== undefined) user.relationship_status = relationship_status;
    if (relationship_story !== undefined) user.relationship_story = relationship_story;
    if (anniversary_date !== undefined) user.anniversary_date = anniversary_date ? new Date(anniversary_date) : null;
    if (avatar !== undefined) user.avatar = avatar;

    let completion = 0;
    if (user.avatar) completion += 20;
    if (user.bio) completion += 20;
    if (user.partner_id) completion += 20;
    if (user.relationship_story) completion += 20;
    if (user.username) completion += 20;
    user.profile_completion = completion;

    await user.save();
    res.status(200).json({ user, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { visibility_settings, notification_preferences, theme_preference } = req.body;
    const user = await User.findOne({ firebase_uid: req.user.firebase_uid || req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (visibility_settings) user.visibility_settings = { ...user.visibility_settings, ...visibility_settings };
    if (notification_preferences) user.notification_preferences = { ...user.notification_preferences, ...notification_preferences };
    if (theme_preference) user.theme_preference = theme_preference;

    await user.save();
    res.status(200).json({ user, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCompatibility = async (req, res) => {
  try {
    const user = await User.findOne({ firebase_uid: req.user.firebase_uid || req.user.uid });
    if (!user || !user.partner_id) return res.status(400).json({ error: 'No partner linked' });

    user.compatibility_score = Math.floor(Math.random() * (100 - 80 + 1) + 80);
    await user.save();
    res.status(200).json({ compatibility_score: user.compatibility_score });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
