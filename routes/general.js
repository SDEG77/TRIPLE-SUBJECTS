const route = require('express').Router();
const LoggerController = require('../controllers/LoggerController') ;
const User = require('../models/User');
const adminAuth = require('../controllers/AdminAuth');
const Admin = require('../models/Admin');
const express = require('express');
const contactController = require('../controllers/ContactController');
const Photo = require('../models/Photo');
const ForgotPasswordController = require('../controllers/ForgotPasswordController');





route.get('/', async (req, res) => {
  try {
    // Fetch photos from the database
    const photos = await Photo.find(); // Fetch all photos from the Photo model

    // Render the index page with photos
    res.render('./general/index', { photos, success: null, error: null });
  } catch (error) {
    console.error(error);
    res.render('./general/index', { photos: [], success: null, error: 'Failed to load photos' });
  }
});

// SIGNUP ROUTES
route.get('/signup', (req, res) => {
  res.render('./general/signup');
});

route.post('/signup', async (req, res) => {
  if(await LoggerController.register({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
  })) {
    // console.log('true in general')
    res.redirect('./login')
  } else {
    // console.log('false in general')
    res.render('./general/signup', {
      message: 'Email has been taken!',
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
    })
  }
});

route.get('/login', (req, res) => {
  res.render('./general/login');
});

let loginMiddleware;


route.post('/login', async (req, res) => {
  const logger = await LoggerController.login({
    email: req.body.email,
    password: req.body.password,
  });

  if (logger) {
    const credentials = await User.find({ email: req.body.email });

    // Set session values
    req.session.userID = credentials[0]._id.toString();
    req.session.name = `${credentials[0].fname.toUpperCase()} ${credentials[0].lname.toUpperCase()}`;
    req.session.email = credentials[0].email;
    req.session.logged = true;
    loginMiddleware = true;

    // Handle "Remember Me" functionality
    if (req.body.remember) {
      // If "Remember Me" is checked, set cookie maxAge to 30 days
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    } else {
      // If not checked, set cookie to expire when the browser is closed (default behavior)
      req.session.cookie.expires = false;
    }

    res.redirect('/ark/client');
  } else {
    // If login fails
    req.session.logged = false;

    res.render('./general/login', {
      message: '(Password was incorrect!)',
      email: req.body.email,
    });
  }
});


route.get('/forgot', (req, res) => {
  res.render('./general/forgot-password');
});

// route.get('/forgot/email', (req, res) => {
//   res.render('./general/email-verification');
// });

// route.get('/forgot/new', (req, res) => {
//   res.render('./general/new-password');
// });

// routes/contactRoutes.js


route.post('/contact', contactController.submitContactForm);


// Password reset request route
route.post('/forgot-password', ForgotPasswordController.requestReset);

// Password reset form (link in the email)
// Password reset form (link in the email)
route.get('/forgot/reset', ForgotPasswordController.resetPasswordForm);

// Update password (after submitting the form)
route.post('/forgot/new', ForgotPasswordController.updatePassword);




module.exports =  route;