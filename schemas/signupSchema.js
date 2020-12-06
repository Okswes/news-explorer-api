const { Joi, Segments } = require('celebrate');

const signupSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
};

module.exports = signupSchema;
