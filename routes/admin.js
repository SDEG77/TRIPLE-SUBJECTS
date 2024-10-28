const route = require("express").Router();
const AdminAuth = require("../controllers/AdminAuth");

const Admin = require("../models/Admin");
const Receipt = require("../models/Receipt");

const User = require("../models/User")
const AdminController = require("../controllers/AdminController");
const ServicesController = require("../controllers/ServicesController");
const PackageController = require("../controllers/PackageController");
const AddOnController = require("../controllers/AddOnController");


const BookingController = require("../controllers/BookingController");
const ContactController = require("../controllers/ContactController");
const PhotoController = require('../controllers/PhotoController');
const UnavailableDate = require('../models/UnavailableDate');



// LOGIN ROUTES
route.get("/login", (req, res) => {
  res.render("admin/adminlogin", { message: "" });
});

route.post("/login", async (req, res) => {
  const isAuthenticated = await AdminAuth.login({
    email: req.body.email,
    password: req.body.password,
  });

  if (isAuthenticated) {
    const adminCredentials = await Admin.find({ email: req.body.email });

    req.session.name = `${adminCredentials[0].fname.toUpperCase()} ${adminCredentials[0].lname.toUpperCase()}`;
    req.session.email = adminCredentials[0].email;
    req.session.isAdminLogged = true;

    res.redirect("/ark/admin");
    // console.log('Admin login successful');
  } else {
    req.session.isAdminLogged = false;

    res.render("admin/adminlogin", {
      message: "(Password was incorrect!)",
      email: req.body.email,
    });
    // console.log('Admin login failed');
  }
});

// Dashboard route
route.get("/", async (req, res) => {
  if (req.session.isAdminLogged) {
    try {
      // Fetch total clients, bookings, and photos
      const totalClients = await AdminController.totalClients();
      const totalBookings = await AdminController.totalBookings();
      const totalPhotos = await AdminController.totalImage();
      const pendingBookings = await AdminController.totalPendingBookings();
      // Fetch approved bookings (upcoming bookings)
      const approvedBookings = await AdminController.getApprovedBookings();

      // Fetch all users to match client_id to names
      const users = await User.find();

     const topServices = await AdminController.getRevenueOverview();

      // Fetch revenue overview (current month)
      const revenueOverview = await AdminController.getRevenueOverview();

      // Render admin dashboard with all the fetched data
      res.render("./admin/admin", {
        totalClients,
        totalBookings,
        totalPhotos,
        pendingBookings, // Pending bookings count
        approvedBookings, // Approved bookings for upcoming dates
        users, // All users to match client_id
        topServices, // Top services and package details
        revenueOverview // Revenue overview with breakdown by service/package
      });
    } catch (error) {
      console.error("Error fetching data for dashboard:", error);
      res.status(500).send("Server Error");
    }
  } else {
    res.redirect("./login");
  }
});


route.get("/revenue", async (req, res) => {
  const timeFrame = req.query.timeFrame || 'month'; // Default to month if not specified

  try {
      const revenueOverview = await AdminController.getRevenueOverview(timeFrame);
      res.json(revenueOverview); // Return the revenue data as JSON
  } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.status(500).send("Server Error");
  }
});


// Route for fetching top services/packages data
route.get('/top-services', async (req, res) => {
  const { timeFrame } = req.query;
  try {
      const topServicesData = await AdminController.getTopServicesOverview(timeFrame);
      res.json(topServicesData);
  } catch (error) {
      console.error('Error fetching top services data:', error);
      res.status(500).json({ error: 'Failed to fetch top services data' });
  }
});

// CLIENT PAGE ROUTES
route.get("/clients", async (req, res) => {
  if (req.session.isAdminLogged) {
    const result = await AdminController.viewClients({
      page: req.query.page, 
      search: req.query.name,
    });

    res.render("./admin/adminclients", { snatch: result });
  } else {
    res.redirect("./login");
  }
});

route.post("/clients", async (req, res) => {
  if (req.session.isAdminLogged) {
    const result = await AdminController.viewClients({
      page: false, 
      search: false,
    });

    await AdminController.deleteClient(req.body.id);

    res.render("./admin/adminclients", { snatch: result });
  } else {
    res.redirect("./login");
  }
});

// BOOKING PAGE ROUTES
route.get("/bookings", async (req, res) => {
  const result = await AdminController.viewBookings({
    page: req.query.page, 
    status: req.query.status,
    search: req.query.name,
  });
  const receipts = await Receipt.find();

  if (req.session.isAdminLogged) {
    res.render("./admin/adminbookings", {
      snatch: result,
      receipts: receipts,
    });
  } else {
    res.redirect("./login");
  }
});

route.post("/bookings/accept", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.accept(req.body.id);
    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.post("/bookings/cancel", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.cancel(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.post("/bookings/reject", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.reject(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.post("/bookings/done", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.done(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.post("/bookings/remove", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.remove(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.post("/bookings/reschedule", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.update({id: req.body.id, time: req.body.time, date: req.body.date});

    res.redirect("./");
  } else {
    res.redirect("/ark/admin/login");
  }
});

// PHOTO MANAGEMENT PAGE ROUTES
route.get("/photo-management", async (req, res) => {
  if (req.session.isAdminLogged) {
    const result = await AdminController.viewClients({
      page: req.query.page, 
      search: req.query.name,
    });
    const photos = await AdminController.viewPhotos(); 

    res.render("./admin/photomanagement", { snatch: result, photos: photos });
  } else {
    res.redirect("/ark/admin/login");
  }
});

// routes.js or your route file

route.post("/photo-management/delete", async (req, res) => {
  console.log(req.body); 
  if (req.session.isAdminLogged) {
    try {
      await AdminController.deletePhoto(req.body.id);
      res.redirect("/ark/admin/photo-management");
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.redirect("/ark/admin/photo-management"); 
    }
  } else {
    res.redirect("/ark/admin/login");
  }
});

route.get('/feedback', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ContactController.getFeedbacks(req, res); // Use the controller function to fetch feedbacks
    // res.render("./admin/feedback");
  } else {
    res.redirect('/ark/login');
  }
});

// Route to handle the reply to feedback (POST request)
route.post('/feedback/reply', async (req, res) => {
  if (req.session.isAdminLogged) {

  await ContactController.replyToFeedback(req, res);
}});

route.delete('/feedback/:id/delete', ContactController.deleteFeedback);  // New route for delete feedback




route.get("/logout", (req, res) => {
  if (req.session.isAdminLogged) {
    req.session.destroy();
    res.redirect("/ark/admin/login");
  } else {
    res.redirect("./login");
  }
});

// RESOURCE ROUTES
route.get("/resource", async (req, res) => {
  if (req.session.isAdminLogged) {
    try {
      const services = await ServicesController.getServices(req, res);
      const packages = await PackageController.getPackages(req, res);
      const addOns = await AddOnController.getAddOns(req, res);

      res.render("admin/resource", { services, packages, addOns, });
    } catch (error) {
      console.error("Error rendering resource page:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect('/ark/login');
  }
});


route.get('/indexmanager', async (req, res) => {
  if (req.session.isAdminLogged) {
    await PhotoController.listPhotos(req, res); // Use the controller function to list photos
  } else {
    res.redirect('/ark/admin/login');
  }
});

route.get('/documentation', async (req, res) => {
  try {
    const bookings = await BookingController.getAllBookings(); // New method in the controller to get all bookings
    res.render('./admin/documentation', { bookings });
  } catch (error) {
    res.status(500).send('Error fetching bookings data');
  }
});

// Route to add a new photo (handle file upload)
route.post('/indexmanager/add', PhotoController.addPhoto);

// Route to delete a photo
route.post('/indexmanager/delete', PhotoController.deletePhoto);

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


route.get('/manage-unavailable-dates', (req, res) => {
  res.render('./admin/manageUnavailableDates'); 
});
module.exports = route;
