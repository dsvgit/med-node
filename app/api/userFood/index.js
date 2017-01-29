var router = require('../router');
var userFoodManager = require('../../logic/userFood');

router.get('/user-foods', function(req, res) {
  var userId = req.currentUser.id;
  var page = req.query.page;
  var search = req.query.search;

  userFoodManager.getFoodsOverview({
    userId: userId,
    page: page,
    search: search,
    pageSize: 10
  })
  .then(function(result) {
    res.json({ foods: result.foods, total: result.total });
  });
});

router.get('/user-food/:id', function(req, res) {
  var userId = req.currentUser.id;
  var id = req.params.id;

  userFoodManager.getFoodById({
    userId: userId,
    id: id
  })
  .then(function(food) {
    return res.json({ food: food });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.post('/user-food', function(req, res) {
  var userId = req.currentUser.id;
  var food = req.body.food;
  userFoodManager.save({
    userId: userId,
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

router.patch('/user-food/:id', function(req, res) {
  var userId = req.currentUser.id;
  var id = req.params.id;
  var food = req.body.food;

  userFoodManager.save({
    userId: userId,
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

router.delete('/user-food/:id', function(req, res) {
  var userId = req.currentUser.id;
  var id = req.params.id;

  userFoodManager.deleteFood({
    userId: userId,
    id: id
  })
  .then(function() {
    return res.json();
  })
  .catch(function() {
    return res.status(500).send('Can\'t delete');
  });
});
