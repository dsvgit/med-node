var _ = require('lodash');

var UserResult = require('../../models/userResult');
var usersManager = require('../users');
var cardsManager = require('../cards');
var foodsManager = require('../food');
var userFoodsManager = require('../userFood');

function getUserCard(params) {
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

function getAvailableFoods(params) {
  return Promise.all([
    foodsManager.getAvailableFoods(params),
    userFoodsManager.getAvailableFoods(params),
  ]).then(function(_results) {
    var foodsResult = _.get(_results, '0.foods');
    var userFoodsResult = _.get(_results, '1.foods');

    var allResults = [].concat(userFoodsResult).concat(foodsResult);

    return {
      foods: allResults
    };
  });
}

function getResults(params) {
  var userId = params.userId;
  var now = new Date();
  var start = new Date(now.setHours(0,0,0,0));
  var end = new Date(now.setHours(23,59,59,999));
  console.log(now);
  console.log(start);
  console.log(end);

  return UserResult.findOne({ userId: userId, updated: { $gte: start, $lt: end } }).sort({ updated: -1 });
}

function saveResults(params) {
  var userId = params.userId;
  var addedFoods = params.addedFoods;
  var now = new Date();

  if (!_.isArray(addedFoods)) {
    return Promise.reject({ message: 'addedFoods must be an array'});
  }

  return cardsManager.getActualCard({
    userId: userId
  })
  .then(function(_card) {
    var card = {};
    if (_card) {
      card = _card;
    }

    var userResult = new UserResult({
      userId: userId,
      addedFoods: addedFoods,
      updated: now,
      card: card
    });

    return userResult.save();
  });
}

module.exports = {
  getUserCard: getUserCard,
  getAvailableFoods: getAvailableFoods,
  saveResults: saveResults,
  getResults: getResults
}
