const crypto = require('crypto');
const Couple = require('../models/Couple');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Helper to generate code
const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 for readability
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CL-${result.slice(0,4)}-${result.slice(4)}`;
};

exports.generateKey = async (req, res) => {
  try {
    const firebase_uid = req.user.firebase_uid || req.user.uid;
    const user = await User.findOne({ firebase_uid });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if user is already in a linked couple
    if (user.couple_id) {
      const existingCouple = await Couple.findById(user.couple_id);
      if (existingCouple && existingCouple.linked) {
        return res.status(400).json({ error: 'User is already part of a couple' });
      }
    }

    // Generate unique code
    let invite_code;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      invite_code = generateInviteCode();
      const existing = await Couple.findOne({ invite_code });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Failed to generate a unique code. Please try again.' });
    }
    
    // UUID for couple
    const couple_id = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    let couple;
    // If they already created an unlinked couple, just update it
    if (user.couple_id) {
      couple = await Couple.findById(user.couple_id);
      if (couple && !couple.linked) {
        couple.invite_code = invite_code;
        couple.code_expires_at = expiresAt;
        await couple.save();
      }
    } 
    
    if (!couple) {
      couple = new Couple({
        couple_id,
        created_by: user._id,
        invite_code,
        code_expires_at: expiresAt
      });
      await couple.save();
      user.couple_id = couple._id;
      await user.save();
    }

    res.status(201).json({ invite_code, code_expires_at: expiresAt });
  } catch (error) {
    console.error('generateKey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.linkPartner = async (req, res) => {
  try {
    const { invite_code } = req.body;
    const firebase_uid = req.user.firebase_uid || req.user.uid; 

    const partner = await User.findOne({ firebase_uid });
    if (!partner) return res.status(404).json({ error: 'Partner not found' });

    if (partner.couple_id) {
      const existingCouple = await Couple.findById(partner.couple_id);
      if (existingCouple && existingCouple.linked) {
        return res.status(400).json({ error: 'You are already linked to a couple' });
      }
    }

    const couple = await Couple.findOne({ invite_code });
    if (!couple) {
      return res.status(404).json({ error: 'Invalid Invite Code' });
    }

    if (couple.linked) {
      return res.status(400).json({ error: 'Partner already linked.' });
    }

    if (couple.code_expires_at && new Date() > couple.code_expires_at) {
      return res.status(400).json({ error: 'This invite code has expired 💔' });
    }

    if (couple.created_by.toString() === partner._id.toString()) {
      return res.status(400).json({ error: 'This code belongs to your account.' });
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

exports.updateAnniversary = async (req, res) => {
  try {
    const { anniversary_date, relationship_started_at } = req.body;
    const firebase_uid = req.user.firebase_uid || req.user.uid;
    const user = await User.findOne({ firebase_uid });

    if (!user || !user.couple_id) return res.status(404).json({ error: 'User or Couple not found' });

    const couple = await Couple.findById(user.couple_id);
    if (!couple || !couple.linked) return res.status(400).json({ error: 'Couple not fully linked' });

    if (anniversary_date) couple.anniversary_date = anniversary_date;
    if (relationship_started_at) couple.relationship_started_at = relationship_started_at;
    await couple.save();

    if (anniversary_date) user.anniversary_date = anniversary_date;
    await user.save();
    
    if (couple.partner_id) {
       const partner = await User.findById(couple.partner_id);
       if (partner && anniversary_date) {
         partner.anniversary_date = anniversary_date;
         await partner.save();
       }
    }

    res.status(200).json({ message: 'Anniversary details updated', couple });
  } catch (error) {
    console.error('updateAnniversary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unlinkPartner = async (req, res) => {
  try {
    const firebase_uid = req.user.firebase_uid || req.user.uid;
    const user = await User.findOne({ firebase_uid });

    if (!user || !user.couple_id) return res.status(404).json({ error: 'No active couple connection found' });

    const couple = await Couple.findById(user.couple_id);
    if (!couple) return res.status(404).json({ error: 'Couple record not found' });

    const partner_id = couple.created_by.toString() === user._id.toString() ? couple.partner_id : couple.created_by;

    // Log the action
    const log = new AuditLog({
      action: 'partner_unlinked',
      user_id: user._id,
      couple_id: couple._id
    });
    await log.save();

    // Clear couple data
    couple.linked = false;
    couple.partner_id = null;
    await couple.save();

    // Clear user data
    user.partner_id = null;
    user.couple_id = null;
    await user.save();

    if (partner_id) {
      const partner = await User.findById(partner_id);
      if (partner) {
        partner.partner_id = null;
        partner.couple_id = null;
        await partner.save();
      }
    }

    res.status(200).json({ message: 'Partner unlinked successfully' });
  } catch (error) {
    console.error('unlinkPartner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
