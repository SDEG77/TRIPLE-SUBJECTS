const mongoose = require('mongoose');
const Package = require('../../models/Package');  // Update with correct path to your Package model
const Service = require('../../models/Service');  // Update with correct path to your Service model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/triple')
.then(() => {
  seedPackages(); // Call the seed function
})
.catch(err => {
  console.error('Database connection error:', err);
});

const packageData = [
  {
    name: 'Solo',
    services: ['Self-Directed Portrait'], // Replace this with actual Service IDs
    duration: 15,
    price: 299,
    description: 'Unlimited shots, 15 enhanced photos',
  },
  {
    name: 'Solo',
    services: ['Self-Directed Portrait'],
    duration: 30,
    price: 549,
    description: 'Unlimited shots, 30 enhanced photos',
  },
  {
    name: 'Duo',
    services: ['Self-Directed Portrait'],
    duration: 15,
    price: 549,
    description: 'Unlimited shots, 20 enhanced photos',
  },
  {
    name: 'Duo',
    services: ['Self-Directed Portrait'],
    duration: 30,
    price: 899,
    description: 'Unlimited shots, 40 enhanced photos',
  },
  {
    name: 'Group',
    services: ['Self-Directed Portrait'],
    duration: 20,
    price: 899,
    description: 'Unlimited shots, 20 enhanced photos',
  },
  {
    name: 'Group',
    services: ['Self-Directed Portrait'],
    duration: 40,
    price: 1499,
    description: 'Unlimited shots, 50 enhanced photos',
  },
  {
    name: 'Specials',
    services: ['Self-Directed Portrait'],
    duration: 100,
    price: 2999,
    description: 'Unlimited shots, all enhanced photos',
  },
  {
    name: 'Duo',
    services: ['Shoot with Professional'],
    duration: 20,
    price: 1099,
    description: 'Unlimited shots, 20 enhanced photos',
  },
  {
    name: 'Duo',
    services: ['Shoot with Professional'],
    duration: 40,
    price: 1899,
    description: 'Unlimited shots, 40 enhanced photos',
  },
  {
    name: 'Group',
    services: ['Shoot with Professional'],
    duration: 30,
    price: 1999,
    description: 'Unlimited shots, 25 enhanced photos',
  },
  {
    name: 'Group',
    services: ['Shoot with Professional'],
    duration: 60,
    price: 2899,
    description: 'Unlimited shots, 50 enhanced photos',
  },
  {
    name: 'Specials',
    services: ['Shoot with Professional'],
    duration: 120,
    price: 3999,
    description: 'Unlimited shots, all enhanced photos',
  },
  {
    name: 'Solo',
    services: ['Shoot with Professional'],
    duration: 20,
    price: 899,
    description: 'Unlimited shots, 15 enhanced photos',
  },
  {
    name: 'Solo',
    services: ['Shoot with Professional'],
    duration: 40,
    price: 1599,
    description: 'Unlimited shots, 30 enhanced photos',
  }
];
/// Seed function
const seedPackages = async () => {
  try {
      // Clear existing packages
      await Package.deleteMany({});

      // Map through packages and replace service names with their corresponding IDs
      const serviceMap = await Service.find({}); // Fetch all services from the DB
      const packageWithIds = packageData.map(pkg => {
          const serviceIds = pkg.services.map(serviceName => {
              // Find the corresponding service ID by name
              const service = serviceMap.find(svc => svc.name === serviceName);
              return service ? service._id : null;
          });
          return { ...pkg, services: serviceIds };
      });

      // Insert the packages with correct service IDs
      await Package.insertMany(packageWithIds);

      console.log('Packages seeded successfully!');
      mongoose.connection.close(); // Close the connection
  } catch (error) {
      console.error('Error seeding packages:', error);
      mongoose.connection.close(); // Ensure connection is closed on error
  }
};