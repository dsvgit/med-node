var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
  prot: Number,
  fats: Number,
  card: Number,
  calories: Number
});

module.exports = mongoose.model('Card', CardSchema);
