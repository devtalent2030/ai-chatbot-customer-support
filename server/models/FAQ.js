// server/models/FAQ.js
const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true
  },
  answer: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', FAQSchema);
