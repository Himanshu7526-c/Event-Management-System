// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/authMiddleware');

// 🔹 POST /api/auth/login { code }
router.post('/login', async (req,res)=>{
  const { code } = req.body;
  if (!code || typeof code !== 'string' || code.length !== 4)
    return res.status(400).json({ msg: 'Provide 4-digit code' });

  // find user by code
  let user = await User.findOne({ code });
  if (!user) return res.status(401).json({ msg: 'Invalid code' });

  // update lastVisit + monthly counter
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  if (!user.monthlyVisitCount || user.monthlyVisitCount.year !== y || user.monthlyVisitCount.month !== m) {
    user.monthlyVisitCount = { year: y, month: m, count: 1 };
  } else {
    user.monthlyVisitCount.count += 1;
  }
  user.lastVisit = now;
  await user.save();

  // sign JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '7d' }
  );

  // send cookie + response
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    // secure: true, // enable in production
  }).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      designation: user.designation
    }
  });
});

// 🔹 GET /api/auth/check
router.get('/check', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// 🔹 POST /api/auth/logout
router.post('/logout', (req,res)=>{
  res.clearCookie('token').json({ success: true, msg: 'Logged out' });
});

module.exports = router;
