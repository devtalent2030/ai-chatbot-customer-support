// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
    // Alternatively, define an enum if you want multiple roles
    // enum: ['admin', 'supportAgent', 'manager', ...]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
