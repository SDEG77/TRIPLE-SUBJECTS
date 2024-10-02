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


module.exports = route;