// Admin routes

// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventActivity = require('../models/EventActivity');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// create event (admin)
router.post('/add-event', authenticate, authorizeAdmin, upload.fields([
  { name: 'photos', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'mediaCoveragePhotos', maxCount: 5 }
]), async (req,res)=>{
  const body = req.body;
  const event = new Event({
    name: body.name,
    description: body.description,
    startDateTime: body.startDateTime,
    endDateTime: body.endDateTime,
    issueDate: body.issueDate,
    location: body.location,
    level: body.level || 'jila',
    eventType: body.eventType,
    createdBy: req.user._id
  });

  if (req.files) {
    if (req.files['photos']) event.media.photos = req.files['photos'].map(f=>'/uploads/'+f.filename);
    if (req.files['mediaCoveragePhotos']) event.media.mediaCoveragePhotos = req.files['mediaCoveragePhotos'].map(f=>'/uploads/'+f.filename);
    if (req.files['video'] && req.files['video'][0]) {
      const vid = req.files['video'][0];
      if (vid.size < 10*1024*1024) return res.status(400).json({ msg: 'Video must be >= 10MB' });
      event.media.video = '/uploads/' + vid.filename;
    }
  }

  await event.save();
  res.json({ event });
});

// admin report for event
router.get('/report/:eventId', authenticate, authorizeAdmin, async (req,res)=>{
  const eventId = req.params.eventId;
  const activities = await EventActivity.find({ event: eventId }).populate('user', 'name designation');
  // compute summary: out of 10 viewed updated etc — we will send raw data
  res.json({ activities });
});

module.exports = router;
