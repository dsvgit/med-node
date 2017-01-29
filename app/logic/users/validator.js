var Joi = require('../../services/joi');


var schema = Joi.object().keys({
  login: Joi.string().alphanum().required(),
  firstname: Joi.string().person_name().required(),
  lastname: Joi.string().person_name().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  isAdmin: Joi.boolean().required()
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
