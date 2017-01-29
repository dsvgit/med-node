var router = require('../router');
var cardsManager = require('../../logic/cards');


router.post('/card/:id', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var id = req.params.id;
  var card = req.body.card;

  cardsManager.save({
    userId: id,
    card: card
  })
  .then(function() {
    return res.json({});
  })
  .catch(function(error) {
    if (error) {
      return res.status(500).send(error);
    }
    return res.status(500).send('Can\'t save');
  });
});
