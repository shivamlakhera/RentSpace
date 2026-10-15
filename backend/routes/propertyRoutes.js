const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getProperties, 
  getPropertyById, 
  getOwnerProperties, 
  deleteProperty 
} = require('../controller/propertyController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Keep files in memory; controller uploads them to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.route('/')
  .get(getProperties)
  .post(protect, upload.array('images', 5), createProperty);

router.get('/owner/listings', protect, getOwnerProperties);

router.route('/:id')
  .get(getPropertyById)
  .delete(protect, deleteProperty);

module.exports = router;