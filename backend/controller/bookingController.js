const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking request
const createBooking = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const booking = await Booking.create({
      property: propertyId,
      seeker: req.user.id,
      owner: property.owner, // Property ka owner save karna zaroori hai validation ke liye
      message,
      status: 'Pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking requests for properties owned by logged-in owner
const getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title city locality rent images') // Yahan 'images' add kar diya
      .populate('seeker', 'name email mobileNo');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings sent by logged-in seeker
const getSeekerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ seeker: req.user.id })
      .populate('property', 'title city locality rent images')
      .populate('owner', 'name email mobileNo');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Accept/Reject) with security check
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    
    const booking = await Booking.findById(req.params.id).populate('property');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Security Check: Kya logged-in user hi is property ka owner hai?
    if (booking.property.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getOwnerBookings, getSeekerBookings, updateBookingStatus };