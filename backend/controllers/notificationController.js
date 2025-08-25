const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Show newest first
    .limit(50); // Limit to the last 50 notifications for performance

  res.status(200).json(notifications);
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id, // Ensure user can only modify their own notification
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  const updatedNotification = await notification.save();

  res.status(200).json(updatedNotification);
});

// @desc    Mark all unread notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
});


module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};