// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bcrypt      = require('bcryptjs');
var cors        = require('cors');
var _           = require('lodash');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user');
var Card   = require('./app/models/card');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(cors());

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
  res.send('Hello!!!! The API is at http://localhost:' + port + '/api');
});

// API ROUTES ------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/admin/authenticate', function(req, res) {
  // find the user
  User.findOne({
    login: req.body.login
  }, function(err, user) {

    if (err) throw err;

    if (!(user && user.isAdmin)) {
      res.status(401).send({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 60*60*24 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

apiRoutes.post('/client/authenticate', function(req, res) {
  // find the user
  User.findOne({
    login: req.body.login
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.status(401).send({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).send({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: 60*60*24 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

// TODO: route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.status(401).send({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        _.assign(req, {
          decoded: decoded,
          currentUser: {
            login: decoded._doc.login
          }
        });
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(401).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/current', function(req, res) {
  User.findOne({ login: req.currentUser.login }, function(err, user) {
    res.json(user);
  });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
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
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages
    res.json({ users: result.docs, total: result.total });
  });
});

apiRoutes.get('/user/:id', function(req, res) {
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

apiRoutes.post('/user', function(req, res) {
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

apiRoutes.patch('/user/:id', function(req, res) {
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

apiRoutes.delete('/user/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ _id: id }, function(err, user) {
    Card.findOne({ _id: id }, function(err, card) {
      user && user.remove();
      card && card.remove();
      res.json();
    });
  });
});

// apply the routes to our application with the prefix /api
app.use('/api/v0', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
