const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
const csv = require('csv-parser');

async function seedUsers() {
  const users = [];

  // Read CSV file and parse each row
  fs.createReadStream('./modified_users_with_oid.csv')
    .pipe(csv())
    .on('data', (row) => {
      try {
        const _id = JSON.parse(row._id).$oid;

        users.push({
          _id: new mongoose.Types.ObjectId(_id), // Use 'new' for ObjectId creation
          fname: row.fname,
          lname: row.lname,
          email: row.email,
          password: row.password,
          isVerified: row.isVerified === 'true', // Convert to boolean if needed
          resetPasswordToken: row.resetPasswordToken || null,
          resetPasswordExpires: row.resetPasswordExpires ? new Date(row.resetPasswordExpires) : null,
        });
      } catch (error) {
        console.error('Error processing row:', row, error);
      }
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

mongoose.connect('mongodb://localhost:27017/triple')
  .then(() => {
    console.log('MongoDB connected');
    seedUsers();
  })
  .catch((error) => console.error('MongoDB connection error:', error));
