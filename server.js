const express = require('express');
const app = express();

const ENV = require('dotenv');
const path = require('path');

const mongoose = require('mongoose');

const generalRoutes = require('./routes/general.js');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const resourceRoutes = require('./routes/resource')
const session = require('express-session');

ENV.config()

const PORT = process.env.PORT || 6969;

mongoose.connect(process.env.MONGO_URI).then(() => {  
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.set('view engine', 'ejs');
  app.set('views', './views');
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(session({
    secret: process.env.WEB_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  const methodOverride = require('method-override');
app.use(methodOverride('_method'));


  app.use('/ark', generalRoutes);
  
  app.use('/ark/client', clientRoutes);

  app.use('/ark/admin', adminRoutes, resourceRoutes);

  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT: [http://localhost:${PORT}/ark]`);
  });
})

