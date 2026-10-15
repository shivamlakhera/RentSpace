const express = require('express');
const { 
  createBooking, 
  getOwnerBookings, 
  updateBookingStatus,
  getSeekerBookings 
} = require('../controller/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/owner', protect, getOwnerBookings);
router.patch('/:id/status', protect, updateBookingStatus);
router.get('/seeker', protect, getSeekerBookings);

module.exports = router;