const route = require('express').Router();

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
  res.render('./admin/adminlogin');
})
route.get('/photo-management', (req, res) => {
  res.render('./admin/photomanagement');
})

module.exports = route;