const mongoose = require('mongoose');

const connectDB = async () => {
  // --- START OF DEBUGGING CODE ---
  // Let's print the variable directly to see what Node.js is reading.
  console.log('--- DEBUGGING MONGO_URI ---');
  console.log('Value of process.env.MONGO_URI:', process.env.MONGO_URI);
  console.log('--- END OF DEBUGGING CODE ---');
  // --- You can remove this block after we solve the issue ---

  // Add a check to ensure MONGO_URI is loaded correctly
  if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in the environment variables.');
    console.error('Please check your .env file in the backend directory.');
    process.exit(1); // Exit with a failure code
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

module.exports = connectDB;