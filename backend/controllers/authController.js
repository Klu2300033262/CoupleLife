const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    const { email, name, firebase_uid, auth_provider, action } = req.body;

    let user = await User.findOne({ firebase_uid });

    if (action === 'signup') {
      if (user) {
        return res.status(400).json({ error: 'User already exists. Please log in.' });
      }
      
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists with different provider' });
      }

      user = new User({
        email,
        name,
        firebase_uid,
        auth_provider
      });
      await user.save();
    } else if (action === 'login') {
      if (!user) {
        return res.status(404).json({ error: 'User does not exist. Please sign up.' });
      }
    } else {
      if (!user) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists with different provider' });
        }
        user = new User({ email, name, firebase_uid, auth_provider });
        await user.save();
      }
    }

    user.online_status = true;
    await user.save();

    const populatedUser = await User.findById(user._id).populate('partner_id').populate('couple_id');
    res.status(200).json({ user: populatedUser });
  } catch (error) {
    console.error('syncUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    const user = await User.findOne({ firebase_uid }).populate('partner_id').populate('couple_id');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.user.email && req.user.email !== user.email) {
      user.email = req.user.email;
    }

    user.online_status = true;
    user.last_active = new Date();
    await user.save();

    const userObj = user.toObject();
    if (userObj.partner_id) {
       const diff = (new Date() - new Date(userObj.partner_id.last_active)) / 1000;
       userObj.partner_id.online_status = diff < 30;
    }

    res.status(200).json({ user: userObj });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    const { name, location } = req.body;
    
    const user = await User.findOne({ firebase_uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (location !== undefined) user.location = location;

    await user.save();
    
    const updatedUser = await User.findById(user._id).populate('partner_id').populate('couple_id');
    res.status(200).json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMood = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    const { mood, note } = req.body;
    
    const user = await User.findOne({ firebase_uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.current_mood = { mood, note, updated_at: new Date() };
    await user.save();
    
    const updatedUser = await User.findById(user._id).populate('partner_id').populate('couple_id');
    res.status(200).json({ user: updatedUser, message: 'Mood updated successfully' });
  } catch (error) {
    console.error('updateMood error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
