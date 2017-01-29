var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
  title: String,
  prot: Number,
  fats: Number,
  carb: Number,
  calories: Number
});

FoodSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Food', FoodSchema);
