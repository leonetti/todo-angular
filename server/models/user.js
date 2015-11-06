var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Model's properties are the user's attributes
// Storing password's hash and salt will allow me to authenticate users without
  // needing to store their passwords in my database
var UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  passwordHash: String,
  passwordSalt: String
});

module.exports = mongoose.model('User', UserSchema);
