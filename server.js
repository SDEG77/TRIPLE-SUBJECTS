const express = require('express');
const app = express();
const web = require('./routes/web');
const PORT = 6969;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT: localhost:${PORT}/`);
});

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/', web);
app.use('/ark', web);