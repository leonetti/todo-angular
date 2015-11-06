// Simulating an instance of the MongoDB Users collection with the users array
// Err and numberAffected are helper variables
// seedUsersCount defines the total number of test users held in the array
var UserMock = function() {
  this.uuid = require('node-uuid');
  this.crypto = require('crypto');
  this.User = require('../models/user.js');
  this.seedUsersCount = 10;
  this.users = [];
  this.err = false;
  this.numberAffected = 0;
};

// Setter method for error
UserMock.prototype.setError = function(err) {
  this.err = err;
};

// Setter method for numberAffected
UserMock.prototype.setNumberAffected = function(number) {
  this.numberAffected = number;
}

// Method to seed the users Array
UserMock.prototype.seedUsers = function() {
  for(var i=0; i<this.seedUsersCount; i++) {

    var passwordSaltIn = this.uuid.v4(),
        cryptoIterations = 10000,
        cryptoKeyLen = 64,
        passwordHashIn;

    var user = new this.User({
      email: 'Test' + i + '@test.com',
      firstName: 'FirstName' + i,
      lastName: 'LastName' + i,
      passwordHash: this.crypto.pbkdf2Sync('Password' + i, passwordSaltIn,
        cryptoIterations, cryptoKeyLen),
      passwordSalt: passwordSaltIn
    });


    this.users.push(user);
  }
};

// Returns one of the User Class instances in the database
UserMock.prototype.getTestUser = function() {
  return this.users? this.users[0] : null;
};

// Create method findById inherited from Mongoose
UserMock.prototype.findById = function(id, callback) {
  for(var i=0, length = this.users.length; i<length; i++) {
    if(this.users[i]._id === id) {
      return callback(this.err, this.users[i]);
    }
  }

  return callback(this.err, null);
};

// Create method findOne inherited from Mongoose
UserMock.prototype.findOne = function(where, callback) {
  for(var i=0, length = this.users.length; i<length; i++) {
    if(this.users[i].email === where.email) {
      return callback(this.err, this.users[i]);
    }
  }

  return callback(this.err, null);
};

// Create save method inherited from Mongoose
UserMock.prototype.save = function(callback) {
  return callback(this.err, this, this.numberAffected);
};

// Create update method inherited from Mongoose
UserMock.prototype.update = function(codintions, update, callback) {
  return callback(this.err, this.numberAffected);
};

module.exports = UserMock;
