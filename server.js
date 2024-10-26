const express = require("express");
const app = express();

const ENV = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

// Import your models for fetching data
const Booking = require("./models/Booking");
const User = require("./models/User");
const Package = require("./models/Package");
const Service = require("./models/Service");
const Receipt = require("./models/Receipt");

ENV.config();

const generalRoutes = require("./routes/general");
const clientRoutes = require("./routes/client");
const adminRoutes = require("./routes/admin");
const resourceRoutes = require("./routes/resource");
const uploadRoutes = require("./routes/upload");

const PORT = process.env.PORT || 6969;
const methodOverride = require('method-override');

app.use(methodOverride('_method'));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "img_uploads")));
    
    app.set("view engine", "ejs");
    app.set("views", "./views");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      session({
        secret: process.env.WEB_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
          // maxAge: 24 * 60 * 60 * 1000  // 24 hours by default
        },
      })
    );

    // Routes
    app.use("/ark", generalRoutes);
    app.use("/ark/client", clientRoutes);
    app.use("/ark/admin", adminRoutes);
    app.use("/ark/admin", resourceRoutes);
    app.use("/ark", uploadRoutes);

 // New API Route to fetch data from all models
 app.get("/api/data", async (req, res) => {
  try {
    const bookings = await Booking.find();
    const users = await User.find();
    const packages = await Package.find().populate('services'); // Populate services in packages
    const services = await Service.find();
    const receipts = await Receipt.find();

    res.json({
      bookings: bookings,
      users: users,
      packages: packages,
      services: services,
      receipts: receipts
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT: [http://localhost:${PORT}/ark]`);
    });
  })
  .catch((err) => console.error(err));
