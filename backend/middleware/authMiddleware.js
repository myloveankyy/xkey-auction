const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// --- NEW: Admin Middleware ---
// This middleware checks if the user has the 'admin' role.
// It must be used AFTER the 'protect' middleware.
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // If user is an admin, proceed to the next function
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin }; // <-- EXPORT NEW MIDDLEWARE