const route = require('express').Router();

route.get('/', (req, res) => {
  res.render('index');
});

route.get('/login', (req, res) => {
  res.render('login');
});

route.get('/signup', (req, res) => {
  res.render('signup');
});

route.get('/client', (req, res) => {
  res.render('client/index'); 
});

route.get('/client/booking', (req, res) => {
  res.render('client/booking'); 
});

route.get('/client/album', (req, res) => {
  res.render('client/album'); 
});

route.get('/client/gallery', (req, res) => {
  res.render('client/gallery'); 
});

module.exports = route;