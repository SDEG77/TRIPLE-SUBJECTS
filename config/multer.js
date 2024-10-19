const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Extract the original file extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only images are allowed'), false);
  }
  cb(null, true);
};

// Initialize upload with multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5 MB limit
});

module.exports = upload;
