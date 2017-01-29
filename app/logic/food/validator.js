var Joi = require('../../services/joi');


var schema = Joi.object().keys({
  title: Joi.string().required(),
  prot: Joi.number().min(0).max(100).required(),
  fats: Joi.number().min(0).max(100).required(),
  carb: Joi.number().min(0).max(100).required(),
  calories: Joi.number().min(0).max(1000).required()
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
