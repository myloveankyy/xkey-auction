const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    // Optional link for the broadcast banner
    link: {
      type: String,
      default: '',
    },
    // Only one broadcast should be active at any given time
    isActive: {
      type: Boolean,
      default: false,
    },
    // The admin who created the broadcast
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

const Broadcast = mongoose.model('Broadcast', broadcastSchema);

module.exports = Broadcast;