const multer = require('multer');
const path = require('path');
const FileFormatError = require('../errors/fileFormatError'); 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml',
    'image/x-icon',
    'image/tiff',
    'image/avif',
    'image/heif',
    'image/heic',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new FileFormatError('Invalid file type. Only JPEG, PNG, GIF, BMP, WEBP, SVG, ICO, TIFF, AVIF, HEIF, and HEIC are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;