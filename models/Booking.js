const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  client_id: String,
  package: String,
  service: String,
  date: Date,
  time: String,
  status: String,
  payment_status: String,
  created_at: Date,
  updated_at: Date,
});


/** @type {import('mongoose').Model()} */
const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;