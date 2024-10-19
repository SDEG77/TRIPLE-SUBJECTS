const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  
});

/** @type {import('mongoose').Model()} */
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
