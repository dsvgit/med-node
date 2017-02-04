var _ = require('lodash');

var router = require('../router');
var calculatorManager = require('../../logic/calculator');


router.get('/user-card', function(req, res) {
  var id = req.currentUser.id;

  calculatorManager.getUserCard({ id: id })
  .then(function(_result) {
    return res.json({ user: _result.user, card: _result.card });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.get('/available-foods', function(req, res) {
  var userId = req.currentUser.id;
  var search = req.query.search;
  console.log(search);

  calculatorManager.getAvailableFoods({ search: search, userId: userId })
  .then(function(result) {
    res.json({ foods: result.foods });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.get('/user-results', function(req, res) {
  var userId = req.currentUser.id;

  calculatorManager.getResults({
    userId: userId
  })
  .then(function(result) {
    return res.json({ addedFoods: result.addedFoods || [] });
  })
  .catch(function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(500).send('Can\'t get');
  });
});

router.patch('/user-results', function(req, res) {
  var userId = req.currentUser.id;
  var addedFoods = req.body.addedFoods;

  calculatorManager.saveResults({
    userId: userId,
    addedFoods: addedFoods
  })
  .then(function(result) {
    return res.json({ addedFoods: result.addedFoods });
  })
  .catch(function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(500).send('Can\'t save');
  });
});
