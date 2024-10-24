const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  bookingId: String,
  uploaded: String,
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Image = mongoose.model('Receipt', receiptSchema);

module.exports = Image;
