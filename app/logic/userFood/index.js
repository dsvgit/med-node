var _ = require('lodash');

var UserFood = require('../../models/userFood');
var validator = require('../food/validator');


function makeErrorMessage(error) {
  return _.get(error, 'details.0.message');
}

function getFoodById(params) {
  var userId = params.userId;
  var id = params.id;

  return UserFood.findOne({
    _id: id,
    userId: userId
  });
}

function save(params) {
  var userId = params.userId;
  var id = params.id;
  if (!id) {
    return add(params);
  }

  return update(params);
}

function add(params) {
  var userId = params.userId;
  var _food = params.food;

  var food = new UserFood(_.assign({}, _food, {
    userId: userId
  }));


  var validation = validator.validate(food);
  var error = validation.error;
  if (error) {
    return Promise.reject({ message: makeErrorMessage(error) });
  }

  return food.save();
}

function update(params) {
  var userId = params.userId;
  var id = params.id;
  var _food = params.food;

  return getFoodById({
    id: id,
    userId: userId
  })
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
  var userId = params.userId;
  var id = params.id;

  return getFoodById({
    id: id,
    userId: userId
  })
  .then(function(food) {
    return food.remove();
  });
}

function getFoodsOverview(params) {
  var userId = params.userId;
  var page = params.page;
  var search = params.search;
  var pageSize = params.pageSize;

  var filter = {};
  if (search) {
    var searchRegExp = new RegExp(search, 'i');
    filter = { title: searchRegExp };
  }
  filter = _.assign({}, filter, {
    userId: userId
  });

  return UserFood.paginate(filter, {
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
