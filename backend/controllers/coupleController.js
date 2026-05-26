const crypto = require('crypto');
const Couple = require('../models/Couple');
const User = require('../models/User');

exports.generateKey = async (req, res) => {
  try {
    const firebase_uid = req.user.uid;
    const user = await User.findOne({ firebase_uid });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user is already in a couple
    if (user.couple_id) {
      return res.status(400).json({ error: 'User is already part of a couple' });
    }

    // Generate random key like CL-7H3K-92PQ
    const randomPart1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const randomPart2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const couple_key = `CL-${randomPart1}-${randomPart2}`;
    
    // UUID for couple
    const couple_id = crypto.randomUUID();

    const couple = new Couple({
      couple_id,
      created_by: user._id,
      couple_key
    });

    await couple.save();

    user.couple_id = couple._id;
    await user.save();

    res.status(201).json({ couple_key });
  } catch (error) {
    console.error('generateKey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.linkPartner = async (req, res) => {
  try {
    const { couple_key } = req.body;
    const firebase_uid = req.user.uid; // partner who just signed up

    const partner = await User.findOne({ firebase_uid });
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    if (partner.couple_id) {
      return res.status(400).json({ error: 'You are already linked to a couple' });
    }

    const couple = await Couple.findOne({ couple_key });
    if (!couple) {
      return res.status(404).json({ error: 'Invalid Couple Key' });
    }

    if (couple.linked) {
      return res.status(400).json({ error: 'This Couple Key has already been used' });
    }

    // Prevent linking to oneself (if that were somehow possible)
    if (couple.created_by.toString() === partner._id.toString()) {
      return res.status(400).json({ error: 'Cannot link with yourself' });
    }

    // Link the partner
    couple.partner_id = partner._id;
    couple.linked = true;
    await couple.save();

    // Update partner's user doc
    partner.couple_id = couple._id;
    partner.partner_id = couple.created_by;
    await partner.save();

    // Update creator's user doc
    const creator = await User.findById(couple.created_by);
    creator.partner_id = partner._id;
    await creator.save();

    res.status(200).json({ message: 'Couple linked successfully', couple });
  } catch (error) {
    console.error('linkPartner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
