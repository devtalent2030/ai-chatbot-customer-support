// server/routes/conversations.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Conversation = require('../models/Conversation');

// We'll store the socket.io instance in this variable after initSocketIO() is called
let ioInstance;

// Exported function to receive the `io` instance from index.js
function initSocketIO(io) {
  ioInstance = io;
}

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

// POST a new conversation
router.post('/', async (req, res) => {
  try {
    const { userId, platform, messages } = req.body;

    // Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const newConversation = new Conversation({
      userId: objectId,
      platform,
      messages,
    });

    await newConversation.save();

    // Emit a 'newConversation' event to all connected clients
    if (ioInstance) {
      ioInstance.emit('newConversation', newConversation);
    }

    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

module.exports = {
  router,
  initSocketIO,
};
