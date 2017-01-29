var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var UserFoodSchema = new Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  prot: Number,
  fats: Number,
  carb: Number,
  calories: Number
});

UserFoodSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('UserFood', UserFoodSchema);
