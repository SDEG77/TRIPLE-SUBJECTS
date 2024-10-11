const route = require('express').Router();
const AdminAuth = require('../controllers/AdminAuth');
const Admin = require('../models/Admin');

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

route.get('/', (req, res) => {
  if(req.session.isAdminLogged) {
    res.render('./admin/admin');
  } else {
    res.redirect('./login');
  }
})
route.get('/bookings', (req, res) => {
  if(req.session.isAdminLogged) {
    res.render('./admin/adminbookings');
  } else {
    res.redirect('./login');
  }
})
route.get('/clients', (req, res) => {
  if(req.session.isAdminLogged) {
    res.render('./admin/adminclients');
  } else {
    res.redirect('./login');
  }
})
route.get('/client', (req, res) => {
  if(req.session.isAdminLogged) {
    res.render('./admin/clients');
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


module.exports = route;