// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../../models/Admin');
const env = require('dotenv');

env.config();

const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('-> Entered triple database: Attempting to seed to admin collection'))
  .catch((err) => console.error('-> MongoDB connection error:', err));

const seedAdmin = async () => {
  let admin;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234', salt);

    admin = new Admin({
      fname: 'Romark',
      lname: 'Bayan',
      email: 'admin@secret.com', 
      password: hashedPassword,
    });
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
  
  try {
    await admin.save();
    console.log(`-> Admin seeded successfully:
[email: admin@secret.com]
[password: 1234]
      `);
  } catch (err) {
    console.log("-> ADMIN ALREADY SEEDED TO COLLECTION:")
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();