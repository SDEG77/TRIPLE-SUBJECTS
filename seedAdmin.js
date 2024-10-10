// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Ensure path is correct

const dbURI = 'mongodb://localhost:27017/triple'; // Adjust as needed

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB database "triple"'))
  .catch((err) => console.error('MongoDB connection error:', err));

const seedAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Romark007!', salt); // Replace with desired password

    const admin = new Admin({
      fname: 'Romark',
      lname: 'Bayan',
      email: 'romark7bayan@gmail.com', // Replace with desired email
      password: hashedPassword,
    });

    await admin.save();
    console.log('Admin user created successfully in "admin" collection of "triple" database');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
