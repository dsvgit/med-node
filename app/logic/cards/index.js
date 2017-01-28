var Card = require('../../models/card');


function getCardById(params) {
  var id = params.id;

  return Card.findById(id);
}

module.exports = {
  getCardById: getCardById
}
