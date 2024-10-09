const express = require('express');
const app = express();
const clientController = require('./routes/client');
const adminController = require('./routes/admin');
const PORT = 6969;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT: [http://localhost:${PORT}/]`);
});

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use('/', clientController);

app.use('/ark/admin/', adminController);