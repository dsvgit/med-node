var _ = require('lodash');
var moment = require('moment');
var mongoose = require('mongoose');

var UserResult = require('../../models/userResult');
var Card = require('../../models/card');
var userManager = require('../users');


function getUserStatistics(params) {
  var userId = params.userId;
  var _now = new Date();

  //console.log(grid);

  $scope = {};
  return userManager.getUserById({ id: userId })
  .then(function(user) {
    if (!user) {
      return Promise.reject();
    }

    var offset = _now.getTimezoneOffset()*60000;
    var tz = user.timezone || 0;
    var userOffset = tz*60*60000;
    var now = new Date(_now.getTime()-offset-userOffset);
    var end = now;
    var start = moment(end).subtract(30, 'days').toDate();
    var grid = makeGrid({
      start: start,
      end: end
    });
    $scope.grid = grid;

    return UserResult.aggregate(
      [
        {$match: {userId: mongoose.Types.ObjectId(userId)}},
        {
          $project : {
            addedFoods: '$addedFoods',
            updated: {$add: ["$updated", tz*60*60*1000]},
            userId: '$userId',
            card: '$card'
          }
        },
        {
          $project : {
            hour: { $hour: "$updated" },
            year: { $year: "$updated" },
            month: { $month: "$updated" },
            day: { $dayOfMonth: "$updated" },
            addedFoods: '$addedFoods',
            updated: '$updated',
            userId: '$userId',
            card: '$card'
          }
        },
        {$sort: {hour: -1, updated: -1}},
        {
          $group : {
            _id: { year: '$year', month: '$month', day: '$day', userId: '$userId' },
            addedFoods: { $first: '$addedFoods' },
            updated: { $first: '$updated' },
            card: { $first: '$card' },
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }}
      ]
    )
  })
  .then(function(_result) {
    console.log(_result);
    var grid = $scope.grid;
    var result = mapData(grid, _result);
    var summedResult = result.map(function(chunk) {
      return Object.assign({}, chunk, {
        summedCalories: _.sumBy(chunk.data, function(food) {
          return food.calories;
        })
      });
    });
    return { statistics: summedResult };
  });
}

function makeGrid(params) {
  var _start = new Date(params.start);
  var _end = new Date(params.end);

  if (!_start || !_end) {
    return;
  }

  var start = moment(_start).startOf('day').toDate();
  var end = moment(_end).endOf('day').toDate();
  console.log('start ' + start);
  console.log('end ' + end);

  var grid = [];
  var currentMoment = null;

  for (var current = start; current <= end ; current = moment(current).add(1, 'days').toDate()) {
    currentMoment = moment(current);
    grid.push({
      year: currentMoment.year(),
      month: currentMoment.month() + 1,
      day: currentMoment.date(),
      date: current
    });
  }

  return grid;
}

function mapData(grid, data) {
  var gridData = [];
  grid.forEach(function(gridChunk) {
    var dataChunk = _.find(data, function(_dataChunk) {
        return (_.get(_dataChunk, '_id.year') == gridChunk.year &&
        _.get(_dataChunk, '_id.month') == gridChunk.month &&
        _.get(_dataChunk, '_id.day') == gridChunk.day);
      }) || {};
    gridData.push({
      '_id': gridChunk,
      'data': dataChunk.addedFoods || null,
      'card': dataChunk.card
    });
  });

  var trimmedGridData = [];
  var flag = false;
  for (var i = 0; i < gridData.length; i++) {
    if (!flag) {
      flag = gridData[i].data != null;
    }
    if (flag) trimmedGridData.push(gridData[i]);
  }

  return trimmedGridData;
}

module.exports = {
  getUserStatistics: getUserStatistics
}
