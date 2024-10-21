const Package = require('../models/Package'); // Import the Package model

// Create a new package
exports.createPackage = async (req, res) => {
  try {
    const package = new Package({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      services: req.body.services, // Array of service ObjectId references
      duration: req.body.duration, // Duration of the package
    });

    await package.save(); // Save to MongoDB

    // Redirect back to the resource page after creation
    res.redirect('/ark/admin/resource');
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).send('Error creating package');
  }
};

// Get all packages and render the view
exports.getPackages = async () => {
  try {
    const packages = await Package.find().populate('services');
    return packages; // Return data instead of sending a response
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error; // Throw error to be caught in the route handler
  }
};

// Get a package by ID
exports.getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id).populate('services'); // Find package by ID and populate services
    if (!package) return res.status(404).send('Package not found');
    res.status(200).json(package);
  } catch (error) {
    res.status(500).send('Error fetching package');
  }
};

// Update a package
exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        services: req.body.services, // Array of service ObjectId references
        duration: req.body.duration,
      },
      { new: true } // Return updated package
    );
    if (!package) return res.status(404).send('Package not found');
    res.redirect('/ark/admin/resource'); // Redirect after updating
  } catch (error) {
    res.status(500).send('Error updating package');
  }
};

// Delete a package
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id); // Delete package by ID
    if (!package) return res.status(404).send('Package not found');
    res.redirect('/ark/admin/resource'); // Redirect after deleting
  } catch (error) {
    res.status(500).send('Error deleting package');
  }
};

exports.groupPackages = async () => {
  try {
    const groupedPackages = await Package.aggregate([
      {
        $lookup: {          
          from: 'services',             
          localField: 'services',       
          foreignField: '_id',          
          as: 'serviceDetails'     
        }
      },
      { 
        $unwind: '$serviceDetails' 
      },
      {
        $group: {
          _id: {
            packageName: '$name',              
            serviceName: '$serviceDetails.name' 
          },
          packages: { $push: '$$ROOT' }        
        }
      }, 
    ]);

    return groupedPackages;
  } catch (error) {
    console.error('Error grouping packages:', error);
  }
}