var Joi = require('../../services/joi');

var max = 999999;

var schema = Joi.object().keys({
  prot: Joi.number().min(0).max(max).required(),
  fats: Joi.number().min(0).max(max).required(),
  carb: Joi.number().min(0).max(max).required(),
  calories: Joi.number().min(0).max(max).required()
});

function validate(user) {
  return Joi.validate(user, schema, {
    abortEarly: true,
    allowUnknown: true
  });
}

module.exports = {
  validate: validate
}
