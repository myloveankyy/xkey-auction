// backend/middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <-- Import the File System module

// --- FIX: Define the upload directory path ---
const uploadDir = path.join(__dirname, '..', 'uploads/images');

// --- FIX: Ensure the directory exists before multer tries to use it ---
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // The first argument is for an error (null here), the second is the destination folder.
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent files with the same name from overwriting each other.
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check if the uploaded file is an image
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/; // Added webp for modern images
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Validation Error: Images Only! (jpg, png, gif, webp)'));
  }
}

// Initialize the upload variable with our configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;