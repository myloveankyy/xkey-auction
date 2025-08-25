const asyncHandler = require('express-async-handler');
const Broadcast = require('../models/broadcastModel');
const User = require('../models/userModel'); // --- IMPORT USER MODEL ---
const Notification = require('../models/notificationModel'); // --- IMPORT NOTIFICATION MODEL ---

// --- PUBLIC FACING FUNCTION ---

const getActiveBroadcast = asyncHandler(async (req, res) => {
  const activeBroadcast = await Broadcast.findOne({ isActive: true });
  res.status(200).json(activeBroadcast);
});


// --- ADMIN ONLY FUNCTIONS ---

const getAllBroadcasts = asyncHandler(async (req, res) => {
  const broadcasts = await Broadcast.find({})
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(broadcasts);
});

const createBroadcast = asyncHandler(async (req, res) => {
  const { message, link } = req.body;
  if (!message) {
    res.status(400);
    throw new Error('Message is required.');
  }
  const broadcast = await Broadcast.create({
    message,
    link,
    createdBy: req.user._id,
    isActive: false,
  });
  res.status(201).json(broadcast);
});

const setActiveBroadcast = asyncHandler(async (req, res) => {
  const broadcastToActivate = await Broadcast.findById(req.params.id);
  if (!broadcastToActivate) {
    res.status(404);
    throw new Error('Broadcast not found.');
  }
  await Broadcast.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
  broadcastToActivate.isActive = true;
  await broadcastToActivate.save();
  res.status(200).json({ message: 'Broadcast activated successfully.' });
});

const deactivateAllBroadcasts = asyncHandler(async (req, res) => {
    await Broadcast.updateMany({}, { isActive: false });
    res.status(200).json({ message: 'All broadcasts have been deactivated.' });
});

const deleteBroadcast = asyncHandler(async (req, res) => {
  const broadcast = await Broadcast.findById(req.params.id);
  if (!broadcast) {
    res.status(404);
    throw new Error('Broadcast not found.');
  }
  await broadcast.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Broadcast deleted.' });
});

// --- NEW: SEND BROADCAST TO ALL USERS' NOTIFICATION BELLS ---
// @desc    Send a specific broadcast as a notification to all users
// @route   POST /api/broadcasts/:id/send-to-all
// @access  Private/Admin
const sendBroadcastToAllUsers = asyncHandler(async (req, res) => {
    // 1. Find the broadcast message to send
    const broadcast = await Broadcast.findById(req.params.id);
    if (!broadcast) {
        res.status(404);
        throw new Error('Broadcast message not found.');
    }

    // 2. Find all registered users
    const allUsers = await User.find({}, '_id'); // Only fetch the IDs for efficiency

    // 3. Prepare the notifications for bulk insertion
    const notifications = allUsers.map(user => ({
        user: user._id,
        message: broadcast.message, // Use the message from the broadcast
        link: broadcast.link || '/notifications', // Use link or default
        isRead: false,
    }));

    // 4. Insert all notifications in one efficient database operation
    if (notifications.length > 0) {
        await Notification.insertMany(notifications);
    }

    res.status(200).json({ message: `Broadcast sent as a notification to ${allUsers.length} users.` });
});


module.exports = {
  getActiveBroadcast,
  getAllBroadcasts,
  createBroadcast,
  setActiveBroadcast,
  deactivateAllBroadcasts,
  deleteBroadcast,
  sendBroadcastToAllUsers, // --- EXPORT THE NEW FUNCTION ---
};