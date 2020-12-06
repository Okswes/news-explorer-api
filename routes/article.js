const article = require('express').Router();
const { celebrate } = require('celebrate');

const { findAllUsersArticles, createArticle, deleteArticle } = require('../controllers/article');
const articleIdSchema = require('../schemas/articleIdSchema');
const createArticleSchema = require('../schemas/createArticleSchema');

article.post('/', celebrate(createArticleSchema), createArticle);
article.get('/', findAllUsersArticles);
article.delete('/:articleId', celebrate(articleIdSchema), deleteArticle);

module.exports = article;
