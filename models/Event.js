const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDateTime: Date,
  endDateTime: Date,
  issueDate: Date,
  location: String,
  level: String,
  eventType: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  media: {
    photos: [String],
    mediaCoveragePhotos: [String],
    video: String
  },
  attendeesCount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
