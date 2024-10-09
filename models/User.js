const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
});

/** @type {import('mongoose').Model} */
const users = mongoose.model('users', userSchema);


module.exports = users;