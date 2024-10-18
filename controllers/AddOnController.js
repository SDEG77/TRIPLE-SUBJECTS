const AddOn = require('../models/AddOn'); // Import the AddOn model

// Create a new add-on
exports.createAddOn = async (req, res) => {
  try {
    const addOn = new AddOn({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    });

    await addOn.save(); // Save to MongoDB

    // Redirect back to the resource page after creation
    res.redirect('/ark/admin/resource');
  } catch (error) {
    console.error('Error creating add-on:', error);
    res.status(500).send('Error creating add-on');
  }
};

// Get all add-ons and render the view
exports.getAddOns = async () => {
  try {
    const addOns = await AddOn.find();
    return addOns; // Return data instead of sending a response
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    throw error; // Throw error to be caught in the route handler
  }
};

// Get an add-on by ID
exports.getAddOnById = async (req, res) => {
  try {
    const addOn = await AddOn.findById(req.params.id); // Find add-on by ID
    if (!addOn) return res.status(404).send('Add-on not found');
    res.status(200).json(addOn);
  } catch (error) {
    res.status(500).send('Error fetching add-on');
  }
};

// Update an add-on
exports.updateAddOn = async (req, res) => {
  try {
    const addOn = await AddOn.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      },
      { new: true } // Return updated add-on
    );
    if (!addOn) return res.status(404).send('Add-on not found');
    res.redirect('/ark/admin/resource'); // Redirect after updating
  } catch (error) {
    res.status(500).send('Error updating add-on');
  }
};

// Delete an add-on
exports.deleteAddOn = async (req, res) => {
  try {
    const addOn = await AddOn.findByIdAndDelete(req.params.id); // Delete add-on by ID
    if (!addOn) return res.status(404).send('Add-on not found');
    res.redirect('/ark/admin/resource'); // Redirect after deleting
  } catch (error) {
    res.status(500).send('Error deleting add-on');
  }
};
