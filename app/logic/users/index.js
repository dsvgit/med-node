var _ = require('lodash');
var bcrypt = require('bcryptjs');

var User = require('../../models/user');
var validator = require('./validator');


function makeErrorMessage(error) {
  return _.get(error, 'details.0.message');
}

function makePassword(password) {
  return bcrypt.hashSync(password, 8)
}

function getUserByLogin(params) {
  var login = params.login;

  return User.findOne({ login: login });
}

function getUserById(params) {
  var id = params.id;

  return User.findById(id);
}

function save(params) {
  var id = params.id;
  if (!id) {
    return add(params);
  }

  return update(params);
}

function add(params) {
  var _user = params.user;

  var user = new User(_.assign({}, _user));
  user.password = makePassword(_user.password);

  var validation = validator.validate(user);
  if (validation.error) {
    return Promise.reject();
  }

  return user.save();
}

function update(params) {
  var id = params.id;
  var _user = params.user;

  return getUserById({ id: id })
  .then(function(user) {
    _.assign(user, _user);
    _user.password && (user.password = makePassword(_user.password));

    var validation = validator.validate(user);
    var error = validation.error;
    if (error) {
      return Promise.reject({ message: makeErrorMessage(error) });
    }

    return user.save();
  });
}

function deleteUser(params) {
  var id = params.id;

  return getUserById({ id: id })
  .then(function(user) {
    return user.remove();
  });
}

function getUsersOverview(params) {
  var page = params.page;
  var search = params.search;
  var pageSize = params.pageSize;

  var filter = {};
  if (search) {
    var searchRegExp = new RegExp(search, 'i');
    filter = {
      '$or': [
        { login: searchRegExp },
        { firstname: searchRegExp },
        { lastname: searchRegExp }
      ]
    };
  }

  return User.paginate(filter, {
    page: page,
    limit: pageSize,
    sort: {
      login: 1
    }
  })
  .then(function(_result) {
    var result = {
      users: _result.docs,
      total: _result.total
    }
    return result;
  });
}

module.exports = {
  getUserByLogin: getUserByLogin,
  getUsersOverview: getUsersOverview,
  getUserById: getUserById,
  save: save,
  deleteUser: deleteUser
}
