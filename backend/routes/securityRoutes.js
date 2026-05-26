const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/audit-logs', requireAuth, securityController.getAuditLogs);
router.post('/delete-account', requireAuth, securityController.deleteAccount);
router.post('/log-action', requireAuth, securityController.logSecurityAction);

module.exports = router;
