const express = require('express');
const { upload } = require('../services/fileService');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Upload single file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files
router.post('/upload-multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const files = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      message: `${files.length} files uploaded successfully`,
      files: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file info (without downloading)
router.get('/file-info/:filename', authenticateToken, async (req, res) => {
  const { filename } = req.params;
  const fs = require('fs');
  const path = require('path');
  
  // Search for file in upload directories
  const searchDirs = ['uploads/pdf', 'uploads/images', 'uploads/audio', 'uploads/video', 'uploads/other'];
  
  for (const dir of searchDirs) {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return res.json({
        filename: filename,
        path: filePath,
        size: stats.size,
        created: stats.birthtime
      });
    }
  }
  
  res.status(404).json({ error: 'File not found' });
});

module.exports = router;