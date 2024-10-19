const mongoose = require('mongoose');

const packageSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }, 
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Array of service references
  duration: { type: Number, required: true }, 
});

/** @type {import('mongoose').Model()} */
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
