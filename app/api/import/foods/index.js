var Requester = require('requester');
var requester = new Requester({
  debug: 1,
  timeout: 60000
});

var router = require('../../router');
var Food = require('../../../models/food');


router.post('/import/foods', function(req, res) {
  if (!req.currentUser.isAdmin) {
    return res.status(403).send('You don\'t have permissions');
  }

  var count = 23343;
  //var count = 10;

  requester.get('http://dietadiary.com/meal/food/json?sEcho=2&iColumns=7&iDisplayStart=0&iDisplayLength=' + count + '&sNames=,,,,,,&bRegex=false&bRegex_0=false&bSearchable_0=true&bRegex_1=false&bSearchable_1=true&bRegex_2=false&bSearchable_2=true&bRegex_3=false&bSearchable_3=true&bRegex_4=false&bSearchable_4=true&bRegex_5=false&bSearchable_5=true&bRegex_6=false&bSearchable_6=true&iSortingCols=1&iSortCol_0=1&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&main=1&_=1485689672192',
    {
      dataType: 'JSON'
    },
    function (body) {
      //console.log(this.statusCode, body.aaData);
      var data = body.aaData;
      Food.remove({})
      .then(function() {
        data.forEach(function(_food) {
          var food = new Food({
            title: _food[1],
            prot: _food[2],
            fats: _food[3],
            carb: _food[4],
            calories: _food[6],
          });

          food.save();
        });
      });

      return res.json();
    });
});
