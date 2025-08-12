// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// --- MODIFIED: Specific CORS configuration ---
// This explicitly allows your frontend (running on your network IP) to make requests.
const corsOptions = {
  origin: [
    'http://localhost:3000', // Allow requests from the desktop browser
    'http://192.168.1.15:3000'  // IMPORTANT: Allow requests from your mobile device
  ],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Middleware
app.use(cors(corsOptions)); // Use the specific options
app.use(express.json()); // For parsing application/json

// Make the 'uploads' folder static/publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// API Routes
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// A simple test route to check if the server is running
app.get('/', (req, res) => {
  res.send('xKeyAuction API is running...');
});

// Get the port from environment variables or use 5001 as default
const PORT = process.env.PORT || 5001;

// Start the server and listen for requests on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and is accessible on your network`);
});