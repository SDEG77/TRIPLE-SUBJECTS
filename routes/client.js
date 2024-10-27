const route = require('express').Router();

const BookingController = require('../controllers/BookingController');
const ServiceController = require('../controllers/ServicesController');
const PackageController = require('../controllers/PackageController');
const AddOnController = require('../controllers/AddOnController');
const ClientController = require('../controllers/ClientController');
const UnavailableDate = require('../models/UnavailableDate');
 



const Photo = require('../models/Photo');
const Booking = require('../models/Booking');

async function sisig_repeater(type, order, req, res) {
  if(req.session.logged) {
    const services = await ServiceController.getServices(); // para sa booking page
    const groups = await PackageController.groupPackages(); // para sa booking page
    const addOns = await AddOnController.getAddOns(); // para sa booking page
    const bookings = await Booking.find({status: "accepted"}); // para sa harang ng occupied time & date
    const bookings_history = await Booking.aggregate([ //para sa profile history page
      { 
        $match: { client_id: req.session.userID } // Match user bookings
      },
      {
        $sort: {
          date: -1 // Sort by date descending (newest at the top)
        }
      },
      {
        $group: {
          _id: "$status", // Group by status
          bookings: { $push: "$$ROOT" } // Push all documents into the 'bookings' array
        }
      },
  
      {
        $project: {
          status: "$_id", // Rename _id to status for easier access in view
          bookings: 1,
          _id: 0
        }
      }
    ]);

    // RENDER FIELDS BATTALION
    const rendID = req.session.userID; //booking, history
    const rendName = req.session.name; //booking, history
    const rendServices = services; //booking
    const rendAddOns = addOns; //booking
    const rendBookings = bookings; //booking
    let rendGroups = groups; //booking
    const rendHistory = bookings_history; //history

    let choice;

    if(type === "get-booking") {
      choice = groups;
    }
    else if (type === "get-history") {
      choice = rendHistory;
    }

    choice.sort((a, b) => {
      let aName;
      let bName;
      let priority;

      if(type === "get-booking"){
        priority = order;
      
        aName = a._id.packageName.toLowerCase();
        bName = b._id.packageName.toLowerCase();
      } 
      
      else if (type === "get-history") {
        priority = order;
      
        aName = a.status.toLowerCase();
        bName = b.status.toLowerCase();
      }

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

    return {
      rendID, rendAddOns, rendBookings, rendGroups, rendName, rendServices, rendHistory
    };
  }
}

route.get('/', async (req, res) => {
  if (req.session.logged) {
    try {
      // Fetch photos from the database
      const photos = await Photo.find();

      // Render the client index page with the user's name and the photos
      res.render('client/index', {
        name: req.session.name,
        photos: photos
      });
    } catch (error) {
      console.error(error);
      res.render('client/index', {
        name: req.session.name,
        photos: photos, // Send an empty array if there's an error fetching photos
        error: 'Failed to load photos'
      });
    }
  } else {
    res.redirect('./login');
  }
});


route.get('/booking', async (req, res) => {
  if(req.session.logged) {
    const give = await sisig_repeater("get-booking", ['solo', 'duo', 'group', 'specials'], req, res);

    res.render('client/booking', {
      id: give.rendID,
      name: give.rendName,
      services: give.rendServices,
      addOns: give.rendAddOns,
      groups: give.rendGroups,
      bookings: give.rendBookings,
    });
  } else {
    res.redirect('../login')
  }
});

route.post('/booking', async (req, res) => {
  const oneOnly = await Booking.find({client_id: req.session.userID, receipt_uploaded: "no",});
  const isItOccupied = await Booking.findOne({status: "accepted", date: req.body.date, time: req.body.time,});

  // if(isItOccupied) {
  //   res.render(./)
  // }
  if(oneOnly.length === 1) {
    res.redirect("./booking")
  } else {
  const give = await sisig_repeater("get-booking", ['solo', 'duo', 'group', 'specials'], req, res);

  let success;
  
  if(req.session.logged) {
    
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
      id: give.rendID,
      name: give.rendName,
      services: give.rendServices,
      addOns: give.rendAddOns,
      groups: give.rendGroups,
      bookings: give.rendBookings,
    });
  } else {
    res.render('client/booking', {
      message: "Booking Unsuccessful",
      id: give.rendID,
      name: give.rendName,
      services: give.rendServices,
      addOns: give.rendAddOns,
      groups: give.rendGroups,
      bookings: give.rendBookings,
    });
  }
}
});

route.get('/profile', (req, res) => {
  if(req.session.logged) {
    res.render('client/profile', {
      name: req.session.name,
      email: req.session.email,
      password: req.session.pazz,
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

route.get('/history', async (req, res) => {
  // const customSortOrder = ["Pending", "Accepted", "Rescheduled", "Done", "Cancelled", "Rejected"];

  if (req.session.logged) {
    const give = await sisig_repeater("get-history", ["re-scheduled", "pending", "accepted", "done", "cancelled", "rejected"], req, res);

    res.render('client/history', {
      name: req.session.name,
      id: req.session.userID,
      history: give.rendHistory,
    });
  } else {
    res.redirect('../login');
  }

  

});
route.get('/unavailable-dates', BookingController.getUnavailableDates);

  route.post('/unavailable-dates', async (req, res) => {
    try {
        const { date, timeSlots } = req.body;
        const newUnavailableDate = new UnavailableDate({ date, timeSlots });
        await newUnavailableDate.save();
        res.status(201).json(newUnavailableDate);
    } catch (error) {
        res.status(500).json({ message: "Error saving unavailable date", error });
    }
});

route.get('/bookings', async (req, res) => {
  try {
      const { date } = req.query; // Receive the date as a query parameter
      const bookings = await BookingController.getBookingsByDate(date);
      res.json(bookings);
  } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Error fetching bookings", error });
  }
});

module.exports = route;