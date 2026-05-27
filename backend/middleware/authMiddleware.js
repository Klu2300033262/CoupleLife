const admin = require('firebase-admin');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify Firebase token
    // If running without valid firebase credentials locally, we might need a bypass for dev
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (err) {
      console.error("Firebase token verification failed", err);
      // Fallback for mocked local testing if needed
      if (process.env.NODE_ENV === 'development' && token.startsWith('mock-')) {
         decodedToken = { uid: token.split('mock-')[1], email: 'mock@example.com' };
      } else {
         return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
      }
    }

    const dbUser = await User.findOne({ firebase_uid: decodedToken.uid });
    req.user = dbUser || { ...decodedToken, firebase_uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { requireAuth };
