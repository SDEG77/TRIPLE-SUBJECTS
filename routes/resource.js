const express = require('express');
const router = express.Router();

// Import Controllers
const ServicesController = require('../controllers/ServicesController');
const PackageController = require('../controllers/PackageController');
const AddOnController = require('../controllers/AddOnController');

// === Service Routes ===
// Get all services and render the admin/resource page (admin only)
router.get('/resource', async (req, res) => {
  if (req.session.isAdminLogged) {
    try {
      const services = await ServicesController.getServices();
      const packages = await PackageController.getPackages();
      const addOns = await AddOnController.getAddOns();

      // Render the resource page with the fetched data
      res.render('admin/resource', { services, packages, addOns });
    } catch (error) {
      res.status(500).send('Error fetching data');
    }
  } else {
    res.redirect('/login');
  }
});

// Create a new service (admin only)
router.post('/services', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ServicesController.createService(req, res);
  } else {
    res.redirect('/login');
  }
});

// **New Route: Get a service by ID for editing**
router.get('/services/:id/edit', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ServicesController.getServiceById(req, res);
  } else {
    res.redirect('/login');
  }
});

// Update a service (admin only)
router.put('/services/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ServicesController.updateService(req, res);
  } else {
    res.redirect('/login');
  }
});

// Delete a service (admin only)
router.delete('/services/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ServicesController.deleteService(req, res);
  } else {
    res.redirect('/login');
  }
});

// === Package Routes ===
// Create a new package (admin only)
router.post('/packages', async (req, res) => {
  if (req.session.isAdminLogged) {
    await PackageController.createPackage(req, res);
  } else {
    res.redirect('/login');
  }
});

// Get a package by ID for editing (admin only)
router.get('/packages/:id/edit', async (req, res) => {
  if (req.session.isAdminLogged) {
    await PackageController.getPackageById(req, res);
  } else {
    res.redirect('/login');
  }
});

// Update a package (admin only)
router.put('/packages/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await PackageController.updatePackage(req, res);
  } else {
    res.redirect('/login');
  }
});

// Delete a package (admin only)
router.delete('/packages/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await PackageController.deletePackage(req, res);
  } else {
    res.redirect('/login');
  }
});

// === Add-on Routes ===
// Create a new add-on (admin only)
router.post('/addons', async (req, res) => {
  if (req.session.isAdminLogged) {
    await AddOnController.createAddOn(req, res);
  } else {
    res.redirect('/login');
  }
});

// Get an add-on by ID for editing (admin only)
router.get('/addons/:id/edit', async (req, res) => {
  if (req.session.isAdminLogged) {
    await AddOnController.getAddOnById(req, res);
  } else {
    res.redirect('/login');
  }
});

// Update an add-on (admin only)
router.put('/addons/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await AddOnController.updateAddOn(req, res);
  } else {
    res.redirect('/login');
  }
});

// Delete an add-on (admin only)
router.delete('/addons/:id', async (req, res) => {
  if (req.session.isAdminLogged) {
    await AddOnController.deleteAddOn(req, res);
  } else {
    res.redirect('/login');
  }
});

module.exports = router;