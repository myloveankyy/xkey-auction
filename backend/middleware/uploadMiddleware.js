const multer = require('multer');
const path = require('path');

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // The first argument is for an error (null here), the second is the destination folder.
    // Make sure the 'backend/uploads/images' directory exists.
    cb(null, 'uploads/images/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent files with the same name from overwriting each other.
    // Filename will be: fieldname-timestamp.extension (e.g., thumbnail-1678886400000.jpg)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check if the uploaded file is an image
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check the extension of the file
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the mime type of the file
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Initialize the upload variable with our configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a 5MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;