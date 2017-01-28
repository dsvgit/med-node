var usersManager = require('../users');
var cardsManager = require('../cards');

function getUserEditor(params) {
  var id = params.id;

  var $result = {};
  return usersManager.getUserById({ id: id })
  .then(function(_user) {
    if (!_user) {
      return Promise.reject();
    }

    $result.user = _user;
    return cardsManager.getActualCard({ userId: id });
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

module.exports = {
  getUserEditor: getUserEditor
}
