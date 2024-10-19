const mongoose = require('mongoose');
const Service = require('../../models/Service'); // Update the path according to your folder structure

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/triple')
.then(() => {
    seedServices(); // Call your seed function
})
.catch(err => {
    console.error('Database connection error:', err);
});

// Define seed data
const servicesData = [
  {
    name: 'Self-Directed Portrait',
    description: 'Client-directed photo session with various packages',
  },
  {
    name: 'Shoot with Professional',
    description: 'Professional photo session with various packages',
  },
  // Add more services based on your data
];

// Seed function
const seedServices = async () => {
    try {
        await Service.deleteMany({}); // Clear existing data
        await Service.insertMany(servicesData); // Insert new data
        console.log('Services seeded successfully!');
        mongoose.connection.close(); // Close the connection when done
    } catch (error) {
        console.error('Error seeding services:', error);
    }
};
