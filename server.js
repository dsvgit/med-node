var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var cors        = require('cors');

var config = require('./config');
var User   = require('./app/models/user');
var Card   = require('./app/models/card');

var router = require('./app/api/router');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(cors());

app.use('/api/v0', router);
require('./app/api/authentication');
require('./app/api/users');
require('./app/api/calculator');
require('./app/api/food');
require('./app/api/userFood');
require('./app/api/cards');
require('./app/api/import/foods');

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
