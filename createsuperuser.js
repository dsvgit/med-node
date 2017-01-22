var mongoose    = require('mongoose');
var bcrypt      = require('bcryptjs');

var config = require('./config');
var User   = require('./app/models/user');

mongoose.connect(config.database);

var user = new User({
  login: 'admin',
  password: bcrypt.hashSync('adminadmin', 8),
  firstname: 'admin',
  lastname: 'admin',
  email: 'admin@admin.com',
  isAdmin: true
});

user.save(function(err) {
  if (err) throw err;
});

mongoose.connection.close();
