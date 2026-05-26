const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, profileController.getProfile);
router.put('/', requireAuth, profileController.updateProfile);
router.put('/settings', requireAuth, profileController.updateSettings);
router.get('/compatibility', requireAuth, profileController.getCompatibility);

module.exports = router;
