var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');

var broker = require('./routes/broker');
var account = require('./routes/account');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', router);

app.use('/api/broker', broker);
app.use('/api/account', account);


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/broker-base', { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

module.exports=app;