var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;        // set our port
var mongoose   = require('mongoose');
var dbName = 'universalDB';
var connectionString = 'mongodb://localhost:27017/' + dbName;
var User = require('./models/user');
var accountRoutes = require('./routes/account');
var mongooseSession = require('mongoose-session');
var expressSession = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
  key: 'session',
  secret: '09/19/1991',
  store: new mongooseSession(mongoose),
  resave: true,
  saveUninitialized: true
}));

mongoose.connect(connectionString); // connect to our database

app.use(express.static(__dirname + '/../client'));
app.use('/api', accountRoutes);

app.listen(port);
console.log('Magic happens on port ' + port);


// var express = require('express'),
//     bodyParser = require('body-parser'),
//     cookieParser = require('cookie-parser'),
//     path = require('path'),
//     mongoose = require('mongoose'),
//     expressSession = require('express-session'),
//     mongooseSession = require('mongoose-session'),
//     // userRoutes = require('./routes/users'),
//     accountRoutes = require('./routes/account');

// var app = express(),
//     port = 8000;

// var dbName = 'universalDB';
// var connectionString = 'mongodb://localhost:27017/' + dbName;

// mongoose.connect(connectionString);

// app.use(expressSession({
//   key: 'session',
//   secret: '09/19/1991',
//   store: new mongooseSession(mongoose),
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use('/api', accountRoutes);
// app.use(express.static(path.join(__dirname, 'client')));

// var server = app.listen(port, function() {
//   console.log('Express server listening on port ' + server.address().port);
// })
