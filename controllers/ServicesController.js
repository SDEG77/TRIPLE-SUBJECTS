// controllers/ServicesController.js
const Service = require('../models/Service'); // Import the Service model

// Create a new service
exports.createService = async (req, res) => {
  try {
    const service = new Service({
      name: req.body.name,
      description: req.body.description,
    });

    await service.save(); // Save the service to MongoDB

    // Redirect back to the resource page after successful creation
    res.redirect('/ark/admin/resource');
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
};

// Get all services
exports.getServices = async () => {
  try {
    const services = await Service.find();
    return services; // Return the services to the calling function
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id); // Find a service by its ID
    if (!service) return res.status(404).send('Service not found');
    res.status(200).json(service);
  } catch (error) {
    res.status(500).send('Error fetching service');
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true } // Return the updated service
    );
    if (!service) return res.status(404).send('Service not found');
    res.redirect('/ark/admin/resource'); // Redirect after updating
  } catch (error) {
    res.status(500).send('Error updating service');
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id); // Delete service by ID
    if (!service) return res.status(404).send('Service not found');
    res.redirect('/ark/admin/resource'); // Redirect after deleting
  } catch (error) {
    res.status(500).send('Error deleting service');
  }
};
