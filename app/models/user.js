var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  login: String,
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  isAdmin: Boolean
});

module.exports = mongoose.model('User', UserSchema);
