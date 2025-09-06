// User model

// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Unknown' },
  code: { type: String, required: true }, // 4-digit code
  role: { type: String, enum: ['user','admin'], default: 'user' },
  designation: { type: String }, // e.g. Jila Addhyaksh
  lastVisit: { type: Date },
  monthlyVisitCount: {
    year: Number,
    month: Number,
    count: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', userSchema);
