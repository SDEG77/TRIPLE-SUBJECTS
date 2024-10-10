const route = require('express').Router();
const express = require('express');
const AdminAuth = require('../controllers/AdminAuth');
const Admin = require('../models/Admin');

route.get('/', (req, res) => {
  res.render('./admin/admin');
})
route.get('/bookings', (req, res) => {
  res.render('./admin/adminbookings');
})
route.get('/clients', (req, res) => {
  res.render('./admin/adminclients');
})
route.get('/client', (req, res) => {
  res.render('./admin/clients');
})
route.get('/login', (req, res) => {
  res.render('admin/adminlogin', { message: '' }); // Default empty message
})
route.get('/photo-management', (req, res) => {
  res.render('./admin/photomanagement');
})


//admin login 

let adminLoginMiddleware;

route.post('/login', async (req, res) => {
  // Authenticate the admin using AdminAuth's login method
  const isAuthenticated = await AdminAuth.login({
    email: req.body.email,
    password: req.body.password,
  });

  if (isAuthenticated) {
    // Find admin details by email
    const adminCredentials = await Admin.find({ email: req.body.email });

    // Store admin information in session
    req.session.name = `${adminCredentials[0].fname.toUpperCase()} ${adminCredentials[0].lname.toUpperCase()}`;
    req.session.email = adminCredentials[0].email;
    req.session.isAdminLogged = true;
    adminLoginMiddleware = true;

    // Redirect to admin dashboard or desired page
    res.redirect('/ark/admin');
    // console.log('Admin login successful');
  } else {
    // If authentication fails, redirect back with an error message
    req.session.isAdminLogged = false;

    // Render the admin login view with an error message
    res.render('admin/adminlogin', {
      message: '(Password was incorrect!)',
      email: req.body.email,
    });
    // console.log('Admin login failed');
  }
});

module.exports = route;