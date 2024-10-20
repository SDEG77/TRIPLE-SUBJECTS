const route = require("express").Router();
const AdminAuth = require("../controllers/AdminAuth");

const Admin = require("../models/Admin");
const AdminController = require("../controllers/AdminController");
const ServicesController = require("../controllers/ServicesController");
const PackageController = require("../controllers/PackageController");
const AddOnController = require("../controllers/AddOnController");


const BookingController = require("../controllers/BookingController");
const ContactController = require("../controllers/ContactController");


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

// DASHBOARD ROUTE
route.get("/", async (req, res) => {
  if (req.session.isAdminLogged) {
    const totalClients = await AdminController.totalClients();
    const totalBookings = await AdminController.totalBookings();
    const totalPhotos = await AdminController.totalImage();

    res.render("./admin/admin", {
      totalClients: totalClients,
      totalBookings: totalBookings,
      totalPhotos: totalPhotos
    });
  } else {
    res.redirect("./login");
  }
});

// CLIENT PAGE ROUTES
route.get("/clients", async (req, res) => {
  if (req.session.isAdminLogged) {
    const clients = await AdminController.viewClients();

    res.render("./admin/adminclients", { clients: clients });
  } else {
    res.redirect("./login");
  }
});

route.post("/clients", async (req, res) => {
  if (req.session.isAdminLogged) {
    await AdminController.deleteClient(req.body.id);

    const clients = await AdminController.viewClients();

    res.render("./admin/adminclients", { clients: clients });
  } else {
    res.redirect("./login");
  }
});

// BOOKING PAGE ROUTES
route.get("/bookings", async (req, res) => {
  const result = await AdminController.viewBookings();

  if (req.session.isAdminLogged) {
    res.render("./admin/adminbookings", {
      snatch: result,
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
    res.redirect("./login");
  }
});

route.post("/bookings/cancel", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.cancel(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("./login");
  }
});

route.post("/bookings/remove", async (req, res) => {
  if (req.session.isAdminLogged) {
    await BookingController.remove(req.body.id);

    res.redirect("./");
  } else {
    res.redirect("./login");
  }
});

// PHOTO MANAGEMENT PAGE ROUTES
route.get("/photo-management", async (req, res) => {
  if (req.session.isAdminLogged) {
    const clients = await AdminController.viewClients();
    const photos = await AdminController.viewPhotos(); 

    res.render("./admin/photomanagement", { clients: clients, photos: photos });
  } else {
    res.redirect("./login");
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
    res.redirect("./login");
  }
});

route.get('/feedback', async (req, res) => {
  if (req.session.isAdminLogged) {
    await ContactController.getFeedbacks(req, res); // Use the controller function to fetch feedbacks
  } else {
    res.redirect('/login');
  }
});



// Route to handle the reply to feedback (POST request)
route.post('/admin/feedback/reply', async (req, res) => {
  if (req.session.isAdminLogged) {

  await ContactController.replyToFeedback(req, res);
}});



route.get("/logout", (req, res) => {
  if (req.session.isAdminLogged) {
    req.session.destroy();
    res.redirect("./login");
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

      res.render("admin/resource", { services, packages, addOns });
    } catch (error) {
      console.error("Error rendering resource page:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.redirect('./login');
  }
});



module.exports = route;
