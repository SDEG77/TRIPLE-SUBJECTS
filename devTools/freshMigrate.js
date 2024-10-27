const mongoose = require('mongoose');
const env = require('dotenv');

const User = require('../models/User');
const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Service = require('../models/Service');
const Addon = require('../models/AddOn');
const Receipt = require('../models/Receipt');
const Image = require('../models/Image');
const Photo = require('../models/Photo');
const Contact = require('../models/Contact');

env.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  full()
  // dev_booking()
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
  await Receipt.deleteMany({});
  await Image.deleteMany({});
  await Photo.deleteMany({});
  await Contact.deleteMany({});  
}

async function dev_booking() {
  await Booking.deleteMany({});
  await Receipt.deleteMany({});
}

async function bookings() {
  await Booking.deleteMany({});
}

async function users() {
  await User.deleteMany({});
}