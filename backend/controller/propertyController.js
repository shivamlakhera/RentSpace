const Property = require('../models/Property');
const { uploadBuffer } = require('../config/cloudinary');

// @desc    Create a new property listing (Owner only with file uploads)
const createProperty = async (req, res) => {
  try {
    const { title, city, locality, propertyType, rent, deposit, rules } = req.body;

    // Frontend FormData se amenities JSON string aati hai, usko safely parse karna
    let parsedAmenities = req.body.amenities;
    if (typeof parsedAmenities === 'string') {
      try {
        parsedAmenities = JSON.parse(parsedAmenities);
      } catch (e) {
        parsedAmenities = {};
      }
    }

    // Multer se aayi hui files ke server paths ki array banana
    const imagePaths = req.files ? await Promise.all(req.files.map(f => uploadBuffer(f.buffer))) : [];

    const property = await Property.create({
      owner: req.user.id,
      title,
      city,
      locality,
      propertyType,
      rent,
      deposit,
      amenities: parsedAmenities,
      rules,
      images: imagePaths // Ye ab local uploaded image paths save karega
    });

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all properties with Advanced Search & Multi-Filters
const getProperties = async (req, res) => {
  try {
    const { city, propertyType, maxRent, wifi, ac, foodFacility, laundry } = req.query;
    let query = { isAvailable: true };

    if (city) query.city = new RegExp(city, 'i'); // Case-insensitive search
    if (propertyType) query.propertyType = propertyType;
    if (maxRent) query.rent = { $lte: Number(maxRent) };

    // Amenity filters
    if (wifi === 'true') query['amenities.wifi'] = true;
    if (ac === 'true') query['amenities.ac'] = true;
    if (foodFacility === 'true') query['amenities.foodFacility'] = true;
    if (laundry === 'true') query['amenities.laundry'] = true;

    const properties = await Property.find(query).populate('owner', 'name email mobileNo');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email mobileNo');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get properties owned by the logged-in owner
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @desc    Delete a property
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getOwnerProperties,
  deleteProperty
};