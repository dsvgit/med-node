var router = require('../router');
var cardsManager = require('../../logic/cards');


router.post('/card/:id', function(req, res) {
  var id = req.params.id;
  var card = req.body.card;

  cardsManager.save({
    userId: id,
    card: card
  })
  .then(function() {
    return res.json({});
  })
  .catch(function() {
    return res.status(500).send('Can\'t post');
  });
});
