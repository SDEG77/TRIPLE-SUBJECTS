const route = require('express').Router();
const AdminAuth = require('../controllers/AdminAuth');
const Admin = require('../models/Admin');

const AdminController = require('../controllers/AdminController');
const ServicesController = require('../controllers/ServicesController');
const PackageController = require('../controllers/PackageController');
const AddOnController = require('../controllers/AddOnController');

route.get('/login', (req, res) => {
  res.render('admin/adminlogin', { message: '' });
})

route.post('/login', async (req, res) => {
  const isAuthenticated = await AdminAuth.login({
    email: req.body.email,
    password: req.body.password,
  });

  if (isAuthenticated) {
    const adminCredentials = await Admin.find({ email: req.body.email });

    req.session.name = `${adminCredentials[0].fname.toUpperCase()} ${adminCredentials[0].lname.toUpperCase()}`;
    req.session.email = adminCredentials[0].email;
    req.session.isAdminLogged = true;

    res.redirect('/ark/admin');
    // console.log('Admin login successful');
  } else {
    req.session.isAdminLogged = false;

    res.render('admin/adminlogin', {
      message: '(Password was incorrect!)',
      email: req.body.email,
    });
    // console.log('Admin login failed');
  }
});

route.get('/', async (req, res) => {
  if(req.session.isAdminLogged) {
    const totalClients = await AdminController.totalClients();
    const totalBookings = await AdminController.totalBookings();

    res.render('./admin/admin', {
      totalClients: totalClients,
      totalBookings: totalBookings,
    });

  } else {
    res.redirect('./login');
  }
})

route.get('/clients', async (req, res) => {
  if(req.session.isAdminLogged) {
    const clients = await AdminController.viewClients();
    
    res.render('./admin/adminclients', {'clients': clients});
  } else {
    res.redirect('./login');
  }
})

route.post('/clients', async (req, res) => {
  if(req.session.isAdminLogged) {
    await AdminController.deleteClient(req.body.id);

    const clients = await AdminController.viewClients();

    res.render('./admin/adminclients', {'clients': clients});
  } else {
    res.redirect('./login');
  }
})

route.get('/bookings', async (req, res) => {
  const result = await AdminController.viewBookings();

  

  if(req.session.isAdminLogged) {
    res.render('./admin/adminbookings', {
      snatch: result,
    });
  } else {
    res.redirect('./login');
  }
})

route.get('/photo-management', (req, res) => {
  if(req.session.isAdminLogged) {
    res.render('./admin/photomanagement');
  } else {
    res.redirect('./login');
  }
})
route.get('/logout', (req, res) => {
  if(req.session.isAdminLogged) {
    req.session.destroy();
    res.redirect('./login')
  } else {
    res.redirect('./login');
  }
})

// routes/admin.js
route.get('/resource', async (req, res) => {
  if (req.session.isAdminLogged) {
    try {
      const services = await ServicesController.getServices(req, res);
      const packages = await PackageController.getPackages(req, res);
      const addOns = await AddOnController.getAddOns(req, res);

      res.render('admin/resource', { services, packages, addOns });
    } catch (error) {
      console.error('Error rendering resource page:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});



module.exports = route;