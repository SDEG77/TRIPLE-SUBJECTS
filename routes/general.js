const route = require('express').Router();
const LoggerController = require('../controllers/LoggerController') ;
const User = require('../models/User');

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

let loginMiddleware;

route.post('/login', async (req, res) => {
  const logger = await LoggerController.login({
    email: req.body.email,
    password: req.body.password,
  });
  
  if(logger) {
    const credentials = await User.find({ email: req.body.email });

    req.session.name = `${credentials[0].fname.toUpperCase()} ${credentials[0].lname.toUpperCase()}`;
    req.session.email = credentials[0].email;
    req.session.logged = true;
    loginMiddleware = true;

    res.redirect('/ark/client');
    // console.log('general was true')
  } else {
    // console.log('general was false')
    req.session.logged = false;
    
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

module.exports =  route;