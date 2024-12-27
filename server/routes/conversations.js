// server/routes/conversations.js
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// GET all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET conversation by ID
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Get conversation by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
