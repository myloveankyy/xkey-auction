const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle', // Link to the vehicle that generated this lead
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'accepted', 'declined'],
      default: 'new',
    },
    // Optional: To store who handled the lead if needed later
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Optional: Notes from admin regarding the lead
    adminNotes: {
        type: String,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;