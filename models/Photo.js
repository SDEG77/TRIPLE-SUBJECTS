const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: { type: String, required: false }, // Optional field for title/alt text
    image_path: { type: String, required: true }, // Path to the image file
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', photoSchema);
