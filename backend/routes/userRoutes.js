// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// The route for creating a new user (admin signup)
// POST to /api/users/register
router.post('/register', registerUser);

// The route for logging in a user
// POST to /api/users/login
router.post('/login', loginUser);

module.exports = router;