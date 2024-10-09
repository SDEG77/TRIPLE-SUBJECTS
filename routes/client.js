const route = require('express').Router();

// GENERAL GET ROUTES
route.get('/', (req, res) => {
  res.render('index');
});

route.get('/login', (req, res) => {
  res.render('login');
});

route.get('/signup', (req, res) => {
  res.render('signup');
});

route.get('/forgot', (req, res) => {
  res.render('forgot-password');
});

route.get('/forgot/email', (req, res) => {
  res.render('email-verification');
});

route.get('/forgot/new', (req, res) => {
  res.render('new-password');
});

// CLIENT GET ROUTES
route.get('/client', (req, res) => {
  res.render('client/index'); 
});

route.get('/client/booking', (req, res) => {
  res.render('client/booking'); 
});

route.get('/client/profile', (req, res) => {
  res.render('client/profile'); 
});

route.get('/client/gallery', (req, res) => {
  res.render('client/gallery'); 
});

module.exports = route;