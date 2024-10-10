const route = require('express').Router();

route.get('/', (req, res) => {
  if (req.session.logged) {
    res.render('client/index', {
      name: req.session.name
    });
  } else {
    res.redirect('./login')
  }
});

route.get('/booking', (req, res) => {
  if(req.session.logged) {
    res.render('client/booking', {name: req.session.name});
  } else {
    res.redirect('../login')
  }
  
});

route.get('/profile', (req, res) => {
  if(req.session.logged) {
    res.render('client/profile', {
      name: req.session.name,
      email: req.session.email,
    }); 
  } else {
    res.redirect('../login')
  }
});

route.get('/gallery', (req, res) => {
  if(req.session.logged) {
    res.render('client/gallery', {
      name: req.session.name,
      email: req.session.email,
    }); 
  } else {
    res.redirect('../login')
  }
});  

route.get('/logout', (req, res) => {
  if(req.session.logged) {
    req.session.destroy((err) => {
      if(err) {
        return new Error(`Log out failed: ${err}`)
      } else {
        res.redirect('../login')
      }
    }); 
  } else {
    res.redirect('../login')
  }
});

module.exports = route;