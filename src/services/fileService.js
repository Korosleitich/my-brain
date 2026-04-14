"// File handling logic" 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['uploads', 'uploads/pdf', 'uploads/images', 'uploads/audio', 'uploads/other'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/other';
    if (file.mimetype === 'application/pdf') folder = 'uploads/pdf';
    if (file.mimetype.startsWith('image/')) folder = 'uploads/images';
    if (file.mimetype.startsWith('audio/')) folder = 'uploads/audio';
    if (file.mimetype.startsWith('video/')) folder = 'uploads/video';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/mp3',
    'video/mp4', 'video/mpeg',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDFs, images, audio, video, and text files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

module.exports = { upload };