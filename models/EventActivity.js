// EventActivity model

// backend/models/EventActivity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewed: { type: Boolean, default: false },
  viewedAt: Date,
  updated: { type: Boolean, default: false },
  updatedAt: Date,
  updateData: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('EventActivity', activitySchema);
