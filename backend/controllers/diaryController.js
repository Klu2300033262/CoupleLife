const Diary = require('../models/Diary');
const Comment = require('../models/Comment');

// Create a new diary
exports.createDiary = async (req, res) => {
  try {
    const { title, content, visibility, images, emojis, mood, tags, pinned, draft_saved } = req.body;
    
    // Couple ID from req.user (set by authMiddleware)
    const couple_id = req.user.couple_id;
    if (!couple_id) {
      return res.status(403).json({ error: 'You must be in a couple to create a diary' });
    }

    const diary = new Diary({
      user_id: req.user.firebase_uid,
      couple_id,
      title,
      content,
      visibility,
      images: images || [],
      emojis: emojis || [],
      mood,
      tags: tags || [],
      pinned: pinned || false,
      draft_saved: draft_saved || false
    });

    await diary.save();
    res.status(201).json({ message: 'Diary created', diary });
  } catch (error) {
    console.error('Error creating diary:', error);
    res.status(500).json({ error: 'Server error creating diary' });
  }
};

// Get all diaries for a couple
exports.getDiaries = async (req, res) => {
  try {
    const couple_id = req.user.couple_id;
    if (!couple_id) {
      return res.status(403).json({ error: 'You must be in a couple to view diaries' });
    }
    
    // We only want to return:
    // 1. Shared diaries of the couple
    // 2. Private diaries of the CURRENT user
    
    const diaries = await Diary.find({
      couple_id,
      $or: [
        { visibility: 'shared' },
        { visibility: 'private', user_id: req.user.firebase_uid }
      ]
    }).sort({ created_at: -1 });

    res.json(diaries);
  } catch (error) {
    console.error('Error fetching diaries:', error);
    res.status(500).json({ error: 'Server error fetching diaries' });
  }
};

// Get a single diary
exports.getDiaryById = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);
    
    if (!diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }
    
    // Authorization check
    if (String(diary.couple_id) !== String(req.user.couple_id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (diary.visibility === 'private' && diary.user_id !== req.user.firebase_uid) {
      return res.status(403).json({ error: 'Not authorized to view this private diary' });
    }

    // Fetch comments if shared
    let comments = [];
    if (diary.visibility === 'shared') {
      comments = await Comment.find({ diary_id: id }).sort({ created_at: 1 });
    }

    res.json({ diary, comments });
  } catch (error) {
    console.error('Error fetching diary:', error);
    res.status(500).json({ error: 'Server error fetching diary' });
  }
};

// Update a diary
exports.updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, visibility, images, emojis, mood, tags, pinned, draft_saved } = req.body;
    
    const diary = await Diary.findById(id);
    if (!diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }
    
    // Only owner can update (for simplicity, or you can allow partner to edit shared diaries)
    if (diary.user_id !== req.user.firebase_uid) {
      return res.status(403).json({ error: 'Not authorized to edit this diary' });
    }

    diary.title = title !== undefined ? title : diary.title;
    diary.content = content !== undefined ? content : diary.content;
    diary.visibility = visibility !== undefined ? visibility : diary.visibility;
    diary.images = images !== undefined ? images : diary.images;
    diary.emojis = emojis !== undefined ? emojis : diary.emojis;
    diary.mood = mood !== undefined ? mood : diary.mood;
    diary.tags = tags !== undefined ? tags : diary.tags;
    diary.pinned = pinned !== undefined ? pinned : diary.pinned;
    diary.draft_saved = draft_saved !== undefined ? draft_saved : diary.draft_saved;

    await diary.save();
    res.json({ message: 'Diary updated', diary });
  } catch (error) {
    console.error('Error updating diary:', error);
    res.status(500).json({ error: 'Server error updating diary' });
  }
};

// Delete a diary
exports.deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findById(id);
    
    if (!diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }
    
    // Only owner can delete
    if (diary.user_id !== req.user.firebase_uid) {
      return res.status(403).json({ error: 'Not authorized to delete this diary' });
    }

    await Diary.deleteOne({ _id: id });
    await Comment.deleteMany({ diary_id: id });
    
    res.json({ message: 'Diary deleted' });
  } catch (error) {
    console.error('Error deleting diary:', error);
    res.status(500).json({ error: 'Server error deleting diary' });
  }
};

// Add a comment to a shared diary
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    
    const diary = await Diary.findById(id);
    if (!diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }
    
    if (diary.visibility !== 'shared') {
      return res.status(400).json({ error: 'Cannot comment on a private diary' });
    }
    if (String(diary.couple_id) !== String(req.user.couple_id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const newComment = new Comment({
      diary_id: id,
      user_id: req.user.firebase_uid,
      comment
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
};

// Toggle reaction on a diary
exports.toggleReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction } = req.body; // e.g., '❤️'
    
    const diary = await Diary.findById(id);
    if (!diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }
    
    if (String(diary.couple_id) !== String(req.user.couple_id) || (diary.visibility === 'private' && diary.user_id !== req.user.firebase_uid)) {
       return res.status(403).json({ error: 'Not authorized' });
    }

    // reactions is a Map: userId -> reaction emoji
    if (diary.reactions && diary.reactions.get(req.user.firebase_uid) === reaction) {
      // Remove reaction if clicking same one
      diary.reactions.delete(req.user.firebase_uid);
    } else {
      if (!diary.reactions) diary.reactions = new Map();
      diary.reactions.set(req.user.firebase_uid, reaction);
    }

    await diary.save();
    res.json({ message: 'Reaction updated', reactions: diary.reactions });
  } catch (error) {
    console.error('Error updating reaction:', error);
    res.status(500).json({ error: 'Server error updating reaction' });
  }
};
