const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are protected and require a logged-in user.
router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/mark-all-read')
  .put(markAllNotificationsAsRead);

router.route('/:id/read')
  .put(markNotificationAsRead);

module.exports = router;