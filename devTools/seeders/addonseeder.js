const mongoose = require('mongoose');
const AddOn = require('../../models/AddOn'); // Import the AddOn model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/triple')
.then(() => {
  seedAddOns(); // Call the seed function after the connection
})
.catch(err => {
  console.error('Database connection error:', err);
});

const addOnData = [
  {
    name: 'Take all enhanced photos',
    description: 'Get all enhanced photos',
    price: 249,
  },
  {
    name: 'Additional Pet',
    description: 'Add a pet to the session',
    price: 249,
  },
  {
    name: 'Additional Person',
    description: 'Add an extra person to the session',
    price: 249,
  },
  {
    name: 'Additional 10 mins',
    description: 'Add 10 minutes to session duration (Self-Directed)',
    price: 249,
  },
  {
    name: 'Additional 15 mins',
    description: 'Add 15 minutes to session duration (Professional)',
    price: 499,
  }
];

async function seedAddOns() {
  try {
    await AddOn.deleteMany({});
    await AddOn.insertMany(addOnData);
    console.log('Add-ons seeded successfully!');
    mongoose.connection.close(); // Close the connection after seeding
  } catch (error) {
    console.error('Error seeding add-ons:', error);
    mongoose.connection.close(); // Ensure the connection is closed on error
  }
}
