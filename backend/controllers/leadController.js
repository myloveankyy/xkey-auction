const asyncHandler = require('express-async-handler');
const Lead = require('../models/leadModel');
const Vehicle = require('../models/vehicleModel'); // To get vehicle details for notifications/populating
const User = require('../models/userModel');       // To find admins for notifications
const Notification = require('../models/notificationModel'); // To create admin notifications

// @desc    Create a new lead (from "Book Now" on public side)
// @route   POST /api/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
  const { vehicleId, phoneNumber } = req.body;

  if (!vehicleId || !phoneNumber) {
    res.status(400);
    throw new Error('Vehicle ID and Phone number are required.');
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found.');
  }

  const lead = await Lead.create({
    vehicle: vehicleId,
    phoneNumber,
    status: 'new',
  });

  // --- NOTIFICATION LOGIC START ---
  // Notify all admins about the new lead
  const admins = await User.find({ role: 'admin' });
  const notificationPromises = admins.map(admin =>
    Notification.create({
      user: admin._id,
      message: `New lead for '${vehicle.vehicleName}' from ${phoneNumber}.`,
      link: `/admin/leads`, // Link to the new admin leads page
    })
  );
  await Promise.all(notificationPromises);
  // --- NOTIFICATION LOGIC END ---

  res.status(201).json({ message: 'Lead submitted successfully. We will contact you soon!' });
});

// @desc    Get all leads (Admin only)
// @route   GET /api/leads
// @access  Private/Admin
const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({})
    .populate('vehicle', 'vehicleName thumbnail') // Populate vehicle name and thumbnail
    .sort({ createdAt: -1 });
  res.status(200).json(leads);
});

// @desc    Update lead status (Admin only)
// @route   PUT /api/leads/:id
// @access  Private/Admin
const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body; // status: 'contacted', 'accepted', 'declined'

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found.');
  }

  // Only allow specific status updates
  const validStatuses = ['new', 'contacted', 'accepted', 'declined'];
  if (status && !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}.`);
  }

  lead.status = status || lead.status;
  lead.adminNotes = adminNotes || lead.adminNotes;
  lead.handledBy = req.user._id; // Mark which admin handled it

  const updatedLead = await lead.save();

  // --- Optional: Notify the user who submitted the lead if they were logged in?
  // For now, we'll keep it admin-focused unless explicitly requested.

  res.status(200).json(updatedLead);
});

// @desc    Delete a lead (Admin only - careful with this)
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
        res.status(404);
        throw new Error('Lead not found.');
    }

    await lead.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Lead deleted successfully.' });
});


module.exports = {
  createLead,
  getAllLeads,
  updateLeadStatus,
  deleteLead,
};