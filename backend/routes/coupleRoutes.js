const express = require('express');
const router = express.Router();
const coupleController = require('../controllers/coupleController');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/generate-key', requireAuth, coupleController.generateKey);
router.post('/link', requireAuth, coupleController.linkPartner);

module.exports = router;
