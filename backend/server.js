const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fs = require('fs');

// Specify the path to the .env file located in the same directory as this server.js file
dotenv.config({ path: path.resolve(__dirname, './.env') });
connectDB();

const app = express();

// --- Create uploads directory if it doesn't exist ---
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

// In production, we don't need the dynamic CORS as the frontend is served from the same origin.
// In development, we still need it.
if (process.env.NODE_ENV !== 'production') {
    const whitelist = ['http://localhost:3000', 'http://192.168.1.5:3000'];
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
}

app.use(express.json());

// Static path for uploaded images, accessible from anywhere
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hero-images', require('./routes/heroImageRoutes'));


// --- DEPLOYMENT CODE START ---
// This code runs only in the production environment
if (process.env.NODE_ENV === 'production') {
  // Set the static folder for our built React frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // For any route that is not our API, just send the index.html file from the build folder
  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  // If not in production, just have a simple welcome message for the API root
  app.get('/', (req, res) => {
    res.send('xKeyAuction API is running...');
  });
}
// --- DEPLOYMENT CODE END ---


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and is accessible on your network`);
});