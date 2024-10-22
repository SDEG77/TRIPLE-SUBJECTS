const mongoose = require('mongoose');
const env = require('dotenv');

const User = require('../models/User');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Service = require('../models/Service');
const Addon = require('../models/AddOn');

env.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  // full()
  // users()
  // bookings()
  console.log('Fresh Migrate Complete')  
});

async function full() {
  await User.deleteMany({});
  await Booking.deleteMany({});
  await Package.deleteMany({});
  await Service.deleteMany({});
  await Addon.deleteMany({});
}

async function bookings() {
  await Booking.deleteMany({});
}

async function users() {
  await User.deleteMany({});
}