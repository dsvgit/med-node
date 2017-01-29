var Joi = require('joi');

var joi = Joi.extend(
  [
    {
      base: Joi.string(),
      name: 'string',
      language: {
        person_name: 'Should be correct name'
      },
      rules: [
        {
          name: 'person_name',
          validate: function(params, value, state, options) {
            if (!value.match(/^[a-zA-Zа-яёА-ЯЁ\s\-]+$/)) {
              return this.createError('string.person_name', { v: value }, state, options);
            }

            return value;
          }
        }
      ]
    }
  ]
);

module.exports = joi;
