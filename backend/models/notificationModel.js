const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // The user who will receive the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The content of the notification message
    message: {
      type: String,
      required: true,
    },
    // A link to navigate to when the notification is clicked (optional)
    link: {
      type: String,
    },
    // A boolean to track if the notification has been read
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;