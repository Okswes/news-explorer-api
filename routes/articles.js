const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getAllArticles, createArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createArticle);
articlesRouter.delete('/:id', celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
