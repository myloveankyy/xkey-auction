const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Notification = require('../models/notificationModel'); // --- IMPORT NOTIFICATION MODEL ---
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (for sellers)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // --- NOTIFICATION LOGIC START ---
    // When a new user signs up, notify all admins.
    const admins = await User.find({ role: 'admin' });
    const notificationPromises = admins.map(admin => 
      Notification.create({
        user: admin._id,
        message: `New seller '${user.name}' has just signed up.`,
        link: `/admin/users`, // Link to the user management page
      })
    );
    await Promise.all(notificationPromises);
    // --- NOTIFICATION LOGIC END ---

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token (login for sellers and admins)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json(user);
});


// --- ADMIN FUNCTIONS ---

// @desc    Create a new admin user
// @route   POST /api/users/create-admin
// @access  Private/Admin
const createAdminUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, and password');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('An admin with that email already exists');
    }

    const adminUser = await User.create({
        name,
        email,
        password,
        role: 'admin',
    });

    if (adminUser) {
        res.status(201).json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin user data');
    }
});

// @desc    Get all users for the admin panel
// @route   GET /api/users/
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
});

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
        res.status(404);
        throw new Error('User not found');
    }

    if (userToDelete._id.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot delete your own admin account.');
    }

    await Vehicle.deleteMany({ seller: userToDelete._id });
    await userToDelete.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'User and all their listings have been deleted.' });
});

// --- NEW: Send a direct notification to a user ---
// @desc    Send a notification to a specific user
// @route   POST /api/users/send-notification
// @access  Private/Admin
const sendDirectNotification = asyncHandler(async (req, res) => {
    const { recipientId, message } = req.body;

    if (!recipientId || !message) {
        res.status(400);
        throw new Error('Recipient ID and message are required.');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        res.status(404);
        throw new Error('Recipient user not found.');
    }

    await Notification.create({
        user: recipientId,
        message: message,
        link: '/notifications', // Generic link to their notifications page
    });

    res.status(201).json({ success: true, message: 'Notification sent successfully.' });
});


module.exports = {
  registerUser,
  loginUser,
  getMe,
  createAdminUser,
  getAllUsers,
  deleteUser,
  sendDirectNotification, // --- EXPORT THE NEW FUNCTION ---
};