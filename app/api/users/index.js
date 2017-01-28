var bcrypt      = require('bcryptjs');
var _           = require('lodash');

var User   = require('../../models/user');
var Card   = require('../../models/card');

var router = require('../router');

router.get('/current', function(req, res) {
  User.findOne({ login: req.currentUser.login }, function(err, user) {
    res.json(user);
  });
});

router.get('/users', function(req, res) {
  var page = req.query.page;
  var search = req.query.search;
  var params = {};
  if (search) {
    var searchRegExp = new RegExp(search, 'i');
    params = {
      '$or': [
        { login: searchRegExp },
        { firstname: searchRegExp },
        { lastname: searchRegExp }
      ]
    };
  }
  var pageSize = 10;
  User.paginate(params, { page: page, limit: pageSize, sort: { login: 1 } }, function(err, result) {
    res.json({ users: result.docs, total: result.total });
  });
});

router.get('/user/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ _id: id }, function(err, user) {
    if (!user) {
      res.status(404).send('Not found');
      return;
    }
    Card.findOne({ _id: id }, function(err, card) {
      if (!card) card = {};
      res.json({ user: user, card: card });
    });
  });
});

router.post('/user', function(req, res) {
  var body = req.body;
  var _user = body.user;
  var user = new User({
    login: _user.login,
    password: bcrypt.hashSync(_user.password, 8),
    firstname: _user.firstname,
    lastname: _user.lastname,
    email: _user.email,
    isAdmin: _user.isAdmin
  });

  user.save();

  var _card = body.card;
  if (_card) {
    var card = new Card({
      _id: user._id,
      prot: _card.prot,
      fats: _card.fats,
      carb: _card.carb,
      calories: _card.calories
    });

    card.save();
  }
  res.json({});
});

router.patch('/user/:id', function(req, res) {
  var id = req.params.id;
  var body = req.body;
  var _user = body.user;

  var userUpdater = {
    login: _user.login,
    firstname: _user.firstname,
    lastname: _user.lastname,
    email: _user.email,
    isAdmin: _user.isAdmin
  };

  if (_user.password) {
    userUpdater.password = bcrypt.hashSync(_user.password, 8)
  }

  var _card = body.card;

  User.findByIdAndUpdate(id, { $set: userUpdater }, { new: true }, function (err, user) {
    if (err) return handleError(err);
    if (_card) {
      Card.findById(id, function(err, card) {
        if (card) {
          _.assign(card, {
            prot: _card.prot,
            fats: _card.fats,
            carb: _card.carb,
            calories: _card.calories
          });
        } else {
          card = new Card({
            _id: id,
            prot: _card.prot,
            fats: _card.fats,
            carb: _card.carb,
            calories: _card.calories
          });
        }

        card.save(function (err, updatedCard) {
          if (err) return handleError(err);
          res.json({ user: user, card: updatedCard });
        });
      });
    } else {
      res.json({ user: user });
    }
  });
});

router.delete('/user/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ _id: id }, function(err, user) {
    Card.findOne({ _id: id }, function(err, card) {
      user && user.remove();
      card && card.remove();
      res.json();
    });
  });
});
