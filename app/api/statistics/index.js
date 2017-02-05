var _ = require('lodash');

var router = require('../router');
var statisticsManager = require('../../logic/statistics');


router.get('/user-statistics', function(req, res) {
  var userId = req.currentUser.id;

  statisticsManager.getUserStatistics({ userId: userId })
  .then(function(result) {
    return res.json({ statistics: result.statistics });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.get('/admin-user-statistics/:id', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var userId = req.params.id;

  statisticsManager.getUserStatistics({ userId: userId })
  .then(function(result) {
    return res.json({ statistics: result.statistics });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});
