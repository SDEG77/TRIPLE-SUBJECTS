const mongoose = require('mongoose');

const addOnSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }, // Additional cost for the add-on
});

/** @type {import('mongoose').Model()} */
const AddOn = mongoose.model('AddOn', addOnSchema);

module.exports = AddOn;
