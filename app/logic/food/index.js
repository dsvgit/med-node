var _ = require('lodash');

var Food = require('../../models/food');
var validator = require('./validator');


function makeErrorMessage(error) {
  return _.get(error, 'details.0.message');
}

function getFoodById(params) {
  var id = params.id;

  return Food.findById(id);
}

function save(params) {
  var id = params.id;
  if (!id) {
    return add(params);
  }

  return update(params);
}

function add(params) {
  var _food = params.food;

  var food = new Food(_food);


  var validation = validator.validate(food);
  var error = validation.error;
  if (error) {
    return Promise.reject({ message: makeErrorMessage(error) });
  }

  return food.save();
}

function update(params) {
  var id = params.id;
  var _food = params.food;

  return getFoodById({ id: id })
  .then(function(food) {
    _.assign(food, _food);


    var validation = validator.validate(food);
    var error = validation.error;
    if (error) {
      return Promise.reject({ message: makeErrorMessage(error) });
    }

    return food.save();
  });
}

function deleteFood(params) {
  var id = params.id;

  return getFoodById({ id: id })
  .then(function(food) {
    return food.remove();
  });
}

function getFoodsOverview(params) {
  var page = params.page;
  var search = params.search;
  var pageSize = params.pageSize;

  var filter = {};
  if (search) {
    var searchRegExp = new RegExp(search, 'i');
    filter = {
      '$or': [
        { title: searchRegExp }
      ]
    };
  }

  return Food.paginate(filter, {
    page: page,
    limit: pageSize,
    sort: {
      title: 1
    }
  })
  .then(function(_result) {
    var result = {
      foods: _result.docs,
      total: _result.total
    }
    return result;
  });
}

module.exports = {
  getFoodsOverview: getFoodsOverview,
  getFoodById: getFoodById,
  save: save,
  deleteFood: deleteFood
}
