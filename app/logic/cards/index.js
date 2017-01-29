var _ = require('lodash');

var Card = require('../../models/card');
var usersManager = require('../users');
var validator = require('./validator');


function makeErrorMessage(error) {
  return _.get(error, 'details.0.message');
}

function getCardById(params) {
  var id = params.id;

  return Card.findById(id);
}

function getActualCard(params) {
  var userId = params.userId;

  return Card.findOne({ userId: userId }).sort({ created: -1 });
}

function save(_params) {
  var userId = _params.userId;
  if (!userId) {
    return Promise.reject();
  }

  return usersManager.getUserById({ id: userId })
  .then(function(user) {
    var params = _.assign({}, _params, {
      userId: user._id
    });

    return add(params);
  });
}

function add(params) {
  var userId = params.userId;
  var _card = params.card;

  var card = new Card(_.assign({}, _card, {
    userId: userId
  }));

  var validation = validator.validate(card);
  var error = validation.error;
  if (error) {
    return Promise.reject({ message: makeErrorMessage(error) });
  }

  return card.save();
}


module.exports = {
  getCardById: getCardById,
  getActualCard: getActualCard,
  save: save
}
