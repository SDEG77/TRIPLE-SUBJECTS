const route = require('express').Router();
const BookingController = require('../controllers/BookingController');

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
    res.render('client/booking', {
      id: req.session.userID,
      name: req.session.name
    });
  } else {
    res.redirect('../login')
  }
});

route.post('/booking', async (req, res) => {
  let success;
  


  if(req.session.logged) {
    success = await BookingController.store({
      client_id: req.body.id,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time,
    });
  } 
  
  else {
    res.redirect('../login')
  }

  if(success) {
    res.render('client/booking', {
      id: req.session.userID,
      name: req.session.name,
      message: "Booking Successful",
      id: req.session.userID,
    });
  } else {
    res.render('client/booking', {
      id: req.session.userID,
      name: req.session.name,
      message: "Booking Unsuccessful",
      id: req.session.userID,
    });
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