const route = require('express').Router();

const BookingController = require('../controllers/BookingController');
const ServiceController = require('../controllers/ServicesController');
const PackageController = require('../controllers/PackageController');
const AddOnController = require('../controllers/AddOnController');
const ClientController = require('../controllers/ClientController');

route.get('/', (req, res) => {
  if (req.session.logged) {
    res.render('client/index',  {
      name: req.session.name
    });
  } else {
    res.redirect('./login')
  }
});

route.get('/booking', async (req, res) => {
  const services = await ServiceController.getServices();
  const groups = await PackageController.groupPackages();
  const addOns = await AddOnController.getAddOns();

  // groups.map(grp => {
  //   grp.packages.map(pkg => {
  //     console.log(`${pkg.name} and is in ${pkg.services}`)
  //   })
  // })

  if(req.session.logged) {
    res.render('client/booking', {
      id: req.session.userID,
      name: req.session.name,
      services: services,
      addOns: addOns,
      groups: groups.sort((a, b) => {
        const priority = ['solo', 'duo', 'group', 'specials'];
      
        const aName = a._id.packageName.toLowerCase();
        const bName = b._id.packageName.toLowerCase();
      
        // Checks if either of them is in the priority list, if not then too bad, they get last priority >:)
        const aPriority = priority.indexOf(aName);
        const bPriority = priority.indexOf(bName);
      
        // If aName or bName has a priority, sort based on that
        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        } else if (aPriority !== -1) {
          return -1; // aName has priority
        } else if (bPriority !== -1) {
          return 1; // bName has priority
        }
      
        // else, fall back to good ol' localeCompare
        return aName.localeCompare(bName);
      }),
      
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

route.get('/gallery', async (req, res) => {
  if (req.session.logged) {
      const clientId = req.session.userID;
      const photo = await ClientController.viewPhotos(clientId);
      res.render('client/gallery', {
          name: req.session.name,
          email: req.session.email,
          photo: photo,
      });
  } else {
      res.redirect('../login');
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