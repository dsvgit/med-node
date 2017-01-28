var _ = require('lodash');
var bcrypt = require('bcryptjs');

var User = require('../../models/user');
var cardsManager = require('../cards');


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

function getUserEditor(params) {
  var id = params.id;

  var $result = {};
  return getUserById({ id: id })
  .then(function(_user) {
    if (!_user) {
      return Promise.reject();
    }

    $result.user = _user;
    return cardsManager.getCardById({ id: id });
  })
  .then(function(_card) {
    var card = {};
    if (_card) {
      card = _card;
    }

    $result.card = card;
    return $result;
  });
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

  return user.save();
}

function update(params) {
  var id = params.id;
  var _user = params.user;

  return getUserById({ id: id })
  .then(function(user) {
    _.assign(user, _user);
    _user.password && (user.password = makePassword(_user.password));

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
  getUserEditor: getUserEditor,
  save: save,
  deleteUser: deleteUser
}
