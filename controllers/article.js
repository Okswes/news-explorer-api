const article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const InvalidDataError = require('../errors/invalid-data-error');

module.exports.findAllUsersArticles = (req, res, next) => {
  const owner = req.user._id;

  article.find({ owner })
    .orFail(() => new NotFoundError('Не найдено ни одной новости!'))
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  const owner = req.user._id;

  article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((post) => {
      if (!post) {
        throw new InvalidDataError('Карточка не создана! Переданы некорректные данные.');
      }
      res.send(post);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const _id = req.params.articleId;
  const owner = req.user._id;
  article.findOneAndDelete({ _id, owner })
    .orFail(() => new NotFoundError('Такая карточка не найдена или недостаточно прав!'))
    .then(() => res.status(201).send({ message: 'Карточка успешно удалена!' }))
    .catch(next);
};
