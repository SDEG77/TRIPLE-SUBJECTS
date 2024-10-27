// models/UnavailableDate.js
const mongoose = require('mongoose');

const unavailableDateSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    timeSlots: {
        type: [String], // Array of unavailable time slots
        required: true,
    },
});

module.exports = mongoose.model('UnavailableDate', unavailableDateSchema);
