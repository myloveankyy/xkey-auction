const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  createAdminUser,
  getAllUsers,
  deleteUser,
  sendDirectNotification, // --- NEW IMPORT ---
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- General Protected Routes ---
router.get('/me', protect, getMe);

// --- Admin-Only Routes ---
// These routes are grouped together and protected by both 'protect' and 'admin' middleware.
router.route('/')
    .get(protect, admin, getAllUsers); // GET /api/users/

router.route('/:id')
    .delete(protect, admin, deleteUser); // DELETE /api/users/:id

// This route allows admins to create other admins.
router.post('/create-admin', protect, admin, createAdminUser);

// --- NEW ROUTE for sending direct notifications ---
router.post('/send-notification', protect, admin, sendDirectNotification);


module.exports = router;