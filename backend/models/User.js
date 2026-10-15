const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNo: { 
    type: String, 
    required: true
   },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seeker', 'owner'],
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);