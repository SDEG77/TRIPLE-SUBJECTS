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

  // RENDER FIELDS BATTALION
  const rendID = req.session.userID;
  const rendName = req.session.name;
  const rendServices = services;
  const rendAddOns = addOns;
  const rendGroups = groups.sort((a, b) => {
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
  });

  if(req.session.logged) {
    res.render('client/booking', {
      id: rendID,
      name: rendName,
      services: rendServices,
      addOns: rendAddOns,
      groups: rendGroups,
    });
  } else {
    res.redirect('../login')
  }
});

route.post('/booking', async (req, res) => {
  const services = await ServiceController.getServices();
  const groups = await PackageController.groupPackages();
  const addOns = await AddOnController.getAddOns();

  // RENDER FIELDS BATTALION
  const rendID = req.session.userID;
  const rendName = req.session.name;
  const rendServices = services;
  const rendAddOns = addOns;
  const rendGroups = groups.sort((a, b) => {
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
  });

  let success;
  
  if(req.session.logged) {
    console.log(req.body.total)
    console.log(req.body.addon)

    success = await BookingController.store({
      client_id: req.body.id,
      service: req.body.service,
      date: req.body.date,
      time: req.body.time,
      total: req.body.total,
      addOns: req.body.addon,
    });
  } 
  
  else {
    res.redirect('../login')
  }

  if(success) {
    res.render('client/booking', {
      message: "Booking Successful",
      id: rendID,
      name: rendName,
      services: rendServices,
      addOns: rendAddOns,
      groups: rendGroups,
    });
  } else {
    res.render('client/booking', {
      message: "Booking Unsuccessful",
      id: rendID,
      name: rendName,
      services: rendServices,
      addOns: rendAddOns,
      groups: rendGroups,    
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