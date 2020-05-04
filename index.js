// package body-parser untuk handle form submission
// package cors agar user dari luar domain bisa melakukan request
// package mongoose untuk mengodb
// package nodemon untuk memonitor node di development-stage / semacam live server

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// DB config
require('./config/db');

const app = express();

const poll = require('./routes/poll');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable cors
app.use(cors());

// ketika ada yg request ke localhost/poll , maka
app.use('/poll', poll);

// start server
const port = 3000;
// let port = process.env.PORT;
// if (port == null || port == '') {
//   port = 8000;
// }
app.listen(port, function () {
  return console.log(`Server berjalan di port ${port}`);
});
