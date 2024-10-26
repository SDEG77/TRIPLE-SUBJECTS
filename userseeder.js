const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Update path to actual User model

async function seedUsers() {
  const users = [];

  fs.createReadStream('./filipino_users.csv') // Path to your CSV file in the root folder
    .pipe(csv())
    .on('data', (row) => {
      users.push({
        _id: row._id,
        fname: row.fname,
        lname: row.lname,
        email: row.email,
        password: bcrypt.hashSync('password123', 10), // Hash a generic password
        isVerified: row.isVerified === 'true',
      });
    })
    .on('end', async () => {
      try {
        await User.insertMany(users);
        console.log('Users have been seeded successfully.');
      } catch (error) {
        console.error('Error seeding users:', error);
      } finally {
        mongoose.connection.close();
      }
    });
}

// Connect to MongoDB and run the seeder
mongoose.connect('mongodb://localhost:27017/triple', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    seedUsers();
  })
  .catch((error) => console.error('MongoDB connection error:', error));
