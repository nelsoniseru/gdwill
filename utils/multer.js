const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique name for the file
  }
});

// File filter for validation (images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed!'), false); // Reject the file
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;