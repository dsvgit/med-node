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
  var id = req.currentUser.id;
  var search = req.query.search;
  console.log(search);

  calculatorManager.getAvailableFoods({ search: search })
  .then(function(result) {
    res.json({ foods: result.foods, total: result.total });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});
