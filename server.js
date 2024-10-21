const express = require("express");
const app = express();

const ENV = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");

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
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use('/index_photos', express.static('index_photos'));


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

    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT: [http://localhost:${PORT}/ark]`);
    });
  })
  .catch((err) => console.error(err));
