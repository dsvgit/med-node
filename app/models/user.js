var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  login: String,
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  isAdmin: Boolean
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
