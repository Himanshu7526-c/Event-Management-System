// Auth middleware

// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req,res,next) => {
  try {
    const token = req.cookies['token'];
    if (!token) return res.status(401).json({ msg: 'Not authenticated' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: 'Invalid token' });
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).json({ msg: 'Auth failed' });
  }
};

exports.authorizeAdmin = (req,res,next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};
