// server/models/Conversation.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id : false });

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // If you want to reference the User model
  },
  platform: {
    type: String,
    required: true
    // e.g., 'whatsapp', 'messenger', or 'web'
  },
  messages: {
    type: [MessageSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
