const route = require('express').Router();
const LoggerController = require('../controllers/LoggerController') ;

route.get('/', (req, res) => {
  res.render('./general/index');
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

route.post('/login', async (req, res) => {
  if(await LoggerController.login({
    email: req.body.email,
    password: req.body.password,
  })) {
    res.redirect('/ark/client')
    // console.log('general was true')
  } else {
    // console.log('general was false')
    res.render('./general/login', {
      message: '(Password was incorrect!)',
      email: req.body.email,
    });
  }
})

route.get('/forgot', (req, res) => {
  res.render('./general/forgot-password');
});

route.get('/forgot/email', (req, res) => {
  res.render('./general/email-verification');
});

route.get('/forgot/new', (req, res) => {
  res.render('./general/new-password');
});

module.exports = route;