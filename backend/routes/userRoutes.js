const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  createAdminUser,
  // --- NEW IMPORTS ---
  getAllUsers,
  deleteUser,
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

// This route can be refactored or kept separate depending on preference.
// For now, it's fine as is.
router.post('/create-admin', protect, admin, createAdminUser);


module.exports = router;