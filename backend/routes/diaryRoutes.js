const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const diaryController = require('../controllers/diaryController');

// All diary routes require authentication
router.use(requireAuth);

// Create a new diary
router.post('/', diaryController.createDiary);

// Get all diaries for the couple
router.get('/', diaryController.getDiaries);

// Get a specific diary by ID
router.get('/:id', diaryController.getDiaryById);

// Update a diary by ID
router.put('/:id', diaryController.updateDiary);

// Delete a diary by ID
router.delete('/:id', diaryController.deleteDiary);

// Add a comment to a diary
router.post('/:id/comments', diaryController.addComment);

// Toggle a reaction on a diary
router.post('/:id/reactions', diaryController.toggleReaction);

module.exports = router;
