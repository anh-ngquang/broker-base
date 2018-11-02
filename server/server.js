var express = require('express');
var router = require('./routes/routes.js');
var path = require('path');
var bodyParser = require('body-parser');

var broker = require('./routes/broker');
var account = require('./routes/account');

var User = require('../models/User');

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

app.use('/api/broker', broker);
app.use('/api/account', account);

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/broker-base', { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() => {
    console.log('connection succesful');
  })
  .catch((err) => console.error(err));

module.exports=app;