const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String,  // Token for password reset
  resetPasswordExpires: Date,  // Expiry date for token
  isVerified: { type: Boolean, default: false } // Add this field

});

/** @type {import('mongoose').Model} */
const users = mongoose.model('users', userSchema);

module.exports = users;
