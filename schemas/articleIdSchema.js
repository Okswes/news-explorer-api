const { Joi, Segments } = require('celebrate');

const articleIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi
      .string()
      .alphanum()
      .length(24)
      .hex()
      .required(),
  }),
};

module.exports = articleIdSchema;
