const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/sync', authController.syncUser);
router.get('/me', requireAuth, authController.getCurrentUser);
router.put('/me', requireAuth, authController.updateProfile);
router.put('/mood', requireAuth, authController.updateMood);

module.exports = router;
