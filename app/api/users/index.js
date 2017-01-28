var router = require('../router');
var usersManager = require('../../logic/users');
var editorManager = require('../../logic/editor');

router.get('/current', function(req, res) {
  var login = req.currentUser.login;

  usersManager.getUserByLogin({login: login})
  .then(function(user) {
    res.json(user);
  });
});

router.get('/users', function(req, res) {
  var page = req.query.page;
  var search = req.query.search;

  usersManager.getUsersOverview({
    page: page,
    search: search,
    pageSize: 10
  })
  .then(function(result) {
    res.json({ users: result.users, total: result.total });
  });
});

router.get('/user/:id', function(req, res) {
  var id = req.params.id;

  editorManager.getUserEditor({ id: id })
  .then(function(_result) {
    return res.json({ user: _result.user, card: _result.card });
  })
  .catch(function() {
    return res.status(404).send('Not found');
  });
});

router.post('/user', function(req, res) {
  var user = req.body.user;
  usersManager.save({
    user: user
  })
  .then(function(user) {
    return res.json({ user: user });
  })
  .catch(function() {
    return res.status(500).send('Can\'t save');
  });
});

router.patch('/user/:id', function(req, res) {
  var id = req.params.id;
  var user = req.body.user;

  usersManager.save({
    id: id,
    user: user
  })
  .then(function(user) {
    return res.json({ user: user });
  })
  .catch(function() {
    return res.status(500).send('Can\'t patch');
  });
});

router.delete('/user/:id', function(req, res) {
  var id = req.params.id;

  usersManager.deleteUser({ id: id })
  .then(function() {
    return res.json();
  })
  .catch(function() {
    return res.status(500).send('Can\'t delete');
  });
});
