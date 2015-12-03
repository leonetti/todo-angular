var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Model's properties are the user's attributes
// Storing password's hash and salt will allow me to authenticate users without
  // needing to store their passwords in my database
var TodoSchema = new Schema({
  email: String,
  content: String,
  day: String,
  update_at: Date
});

module.exports = mongoose.model('Todo', TodoSchema);
