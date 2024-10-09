const route = require('express').Router();

route.get('/', (req, res) => {
  res.render('client/index'); 
});

route.get('/booking', (req, res) => {
  res.render('client/booking'); 
});

route.get('/profile', (req, res) => {
  res.render('client/profile'); 
});

route.get('/gallery', (req, res) => {
  res.render('client/gallery'); 
});

module.exports = route;