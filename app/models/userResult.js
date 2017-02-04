var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var UserResultSchema = new Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  addedFoods: [{
    id: String,
    title: String,
    prot: Number,
    fats: Number,
    carb: Number,
    calories: Number,
    amount: Number
  }],
  updated: Date
});

module.exports = mongoose.model('UserResult', UserResultSchema);
