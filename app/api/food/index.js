var router = require('../router');
var foodManager = require('../../logic/food');

router.get('/foods', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var page = req.query.page;
  var search = req.query.search;

  foodManager.getFoodsOverview({
    page: page,
    search: search,
    pageSize: 10
  })
  .then(function(result) {
    res.json({ foods: result.foods, total: result.total });
  });
});

router.get('/food/:id', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var id = req.params.id;

  foodManager.getFoodById({ id: id })
  .then(function(food) {
    return res.json({ food: food });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.post('/food', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var food = req.body.food;
  foodManager.save({
    food: food
  })
  .then(function(food) {
    return res.json({ food: food });
  })
  .catch(function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(500).send('Can\'t save');
  });
});

router.patch('/food/:id', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var id = req.params.id;
  var food = req.body.food;

  foodManager.save({
    id: id,
    food: food
  })
  .then(function(food) {
    return res.json({ food: food });
  })
  .catch(function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(500).send('Can\'t save');
  });
});

router.delete('/food/:id', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var id = req.params.id;

  foodManager.deleteFood({ id: id })
  .then(function() {
    return res.json();
  })
  .catch(function() {
    return res.status(500).send('Can\'t delete');
  });
});
