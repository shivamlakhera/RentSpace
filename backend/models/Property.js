const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['PG', 'Single Room', 'Flat'],
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  amenities: {
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    foodFacility: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false }
  },
  rules: {
    type: String
  },
  images: [{
    type: String
  }],
  isAvailable: {
    type: Boolean, default: true
  }
}, {
  timestamps: true
});

// Check karo ki model pehle se mongoose mein registered hai ya nahi, warna naya banao
module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);