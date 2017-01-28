var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  created: { type: Date, default: Date.now },
  prot: Number,
  fats: Number,
  carb: Number,
  calories: Number
});

module.exports = mongoose.model('Card', CardSchema);
