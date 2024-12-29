// server/models/Conversation.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference the User model (if applicable)
  },
  platform: {
    type: String,
    required: true,
    // Examples: 'whatsapp', 'messenger', or 'web'
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
