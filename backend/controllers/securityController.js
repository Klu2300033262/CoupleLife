const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const logAction = async (user_id, action, old_value, new_value, req) => {
  await AuditLog.create({
    user_id,
    action,
    old_value,
    new_value,
    ip_address: req.ip,
    device: req.headers['user-agent']
  });
};

exports.getAuditLogs = async (req, res) => {
  try {
    const user = await User.findOne({ firebase_uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const logs = await AuditLog.find({ user_id: user._id }).sort({ timestamp: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findOne({ firebase_uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await logAction(user._id, 'ACCOUNT_DELETED', null, null, req);

    if (user.partner_id) {
      await User.findByIdAndUpdate(user.partner_id, { partner_id: null, couple_id: null });
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logSecurityAction = async (req, res) => {
  try {
    const { action, detail } = req.body;
    const user = await User.findOne({ firebase_uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await logAction(user._id, action, null, detail, req);
    res.status(200).json({ message: 'Action logged' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
