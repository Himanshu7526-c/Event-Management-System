const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const EventActivity = require("../models/EventActivity");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 🔹 Create Event (admin only)
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "video", maxCount: 1 },
    { name: "mediaCoveragePhotos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      if (req.user.role !== "admin")
        return res.status(403).json({ msg: "Access denied" });

      const { name, description, startDateTime, endDateTime, location, eventType } =
        req.body;

      if (!name || !startDateTime || !endDateTime)
        return res.status(400).json({ msg: "Required fields missing" });

      const newEvent = new Event({
        name,
        description,
        startDateTime,
        endDateTime,
        location,
        eventType,
        createdBy: req.user.id,
        media: {},
      });

      if (req.files) {
        if (req.files["photos"])
          newEvent.media.photos = req.files["photos"].map((f) => f.path);
        if (req.files["mediaCoveragePhotos"])
          newEvent.media.mediaCoveragePhotos = req.files["mediaCoveragePhotos"].map(
            (f) => f.path
          );
        if (req.files["video"] && req.files["video"][0])
          newEvent.media.video = req.files["video"][0].path;
      }

      await newEvent.save();
      res.status(201).json({ success: true, event: newEvent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: err.message });
    }
  }
);

// 🔹 Get events
router.get("/", authenticate, async (req, res) => {
  const { type } = req.query;
  const now = new Date();
  let filter = {};
  if (type === "ongoing") filter = { startDateTime: { $lte: now }, endDateTime: { $gte: now } };
  else if (type === "previous") filter = { endDateTime: { $lt: now } };

  const events = await Event.find(filter).sort({ startDateTime: -1 });
  res.json(events);
});

// 🔹 Event details & mark viewed
router.get("/:id", authenticate, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event missing" });

  let act = await EventActivity.findOne({ event: event._id, user: req.user._id });
  if (!act) act = new EventActivity({ event: event._id, user: req.user._id, viewed: true, viewedAt: new Date() });
  else { act.viewed = true; act.viewedAt = new Date(); }

  await act.save();
  res.json({ event, activity: act });
});

// 🔹 Update Event (user update limited fields)
router.put("/:id/update", authenticate, upload.fields([
  { name: "photos", maxCount: 10 },
  { name: "video", maxCount: 1 },
  { name: "mediaCoveragePhotos", maxCount: 5 },
]), async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: "Event not found" });

  const allowed = ["location", "startDateTime", "endDateTime", "attendeesCount"];
  allowed.forEach((k) => { if (req.body[k]) event[k] = req.body[k]; });

  if (req.files) {
    if (req.files["photos"]) event.media.photos = (event.media.photos || []).concat(req.files["photos"].map(f => f.path)).slice(0,10);
    if (req.files["mediaCoveragePhotos"]) event.media.mediaCoveragePhotos = (event.media.mediaCoveragePhotos || []).concat(req.files["mediaCoveragePhotos"].map(f => f.path)).slice(0,5);
    if (req.files["video"] && req.files["video"][0]) event.media.video = req.files["video"][0].path;
  }

  await event.save();

  let act = await EventActivity.findOne({ event: event._id, user: req.user._id });
  const now = new Date();
  if (!act) act = new EventActivity({ event: event._id, user: req.user._id, updated: true, updatedAt: now });
  else { act.updated = true; act.updatedAt = now; act.updateData = req.body; }

  await act.save();
  res.json({ event });
});

module.exports = router;
