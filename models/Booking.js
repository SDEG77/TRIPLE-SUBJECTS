const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Reference to User model
  receipt_uploaded: String,
  package: String,
  service: String,
  addOns: Array,
  date: Date,
  time: String,
  status: String,
  payment_status: String,
  total: String,

  // created_at: Date,
  // updated_at: Date,
});


/** @type {import('mongoose').Model()} */
const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;