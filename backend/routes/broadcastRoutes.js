const express = require('express');
const router = express.Router();
const {
  getActiveBroadcast,
  getAllBroadcasts,
  createBroadcast,
  setActiveBroadcast,
  deactivateAllBroadcasts,
  deleteBroadcast,
  sendBroadcastToAllUsers, // --- NEW IMPORT ---
} = require('../controllers/broadcastController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Public Route ---
router.get('/active', getActiveBroadcast);

// --- Admin-Only Routes ---
router.route('/')
    .get(protect, admin, getAllBroadcasts)
    .post(protect, admin, createBroadcast);

router.put('/deactivate-all', protect, admin, deactivateAllBroadcasts);

router.route('/:id')
    .delete(protect, admin, deleteBroadcast);

router.put('/:id/activate', protect, admin, setActiveBroadcast);

// --- NEW ROUTE for sending broadcast to all users ---
router.post('/:id/send-to-all', protect, admin, sendBroadcastToAllUsers);


module.exports = router;