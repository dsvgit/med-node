var _           = require('lodash');
var bcrypt      = require('bcryptjs');
var jwt    = require('jsonwebtoken');

var config = require('../../../config');
var User   = require('../../models/user');
var router = require('../router');


function makeError(res, message) {
  res.status(401).send({
    message: message
  });
}

router.post('/authenticate', function(req, res) {
  var admin = Boolean(req.query.admin);
  console.log(admin, req.query.admin);
  var login = req.body.login;
  var password = req.body.password;

  User.findOne({
    login: login
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      makeError(res, 'Authentication failed. User not found.');
      return;
    }

    if (admin && !user.isAdmin) {
      makeError(res, 'Authentication failed. Isn\'t admin.');
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      makeError(res, 'Authentication failed. Wrong password.');
      return;
    }

    var token = jwt.sign(user, config.secret, {
      expiresIn: 60*60*24
    });

    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token
    });
  });
});


router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    makeError(res, 'No token provided.');
    return;
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      makeError(res, 'Failed to authenticate token.');
      return;
    }

    _.assign(req, {
      decoded: decoded,
      currentUser: {
        login: decoded._doc.login
      }
    });
    next();
  });
});
