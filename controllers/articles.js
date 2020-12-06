const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err.js');
const WrongDataError = require('../errors/wrong-data-err.js');
const AccessError = require('../errors/access-err.js');

const getAllArticles = (req, res, next) => Article.find({})
  .then((articles) => res.send(articles))
  .catch(next);

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .catch(() => {
      throw new NotFoundError({ message: 'Нет такой статьи' });
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new AccessError('Вы не можете удалить эту статью');
      }
      Article.deleteOne(item)
        .then(() => {
          res.status(200).send({ message: 'Cтатья удалена' });
        })
        .catch(next);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, image, link,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, image, link, owner: req.user._id,
  })
    .then((item) => res.status(200).send(item))
    .catch(() => {
      next(new WrongDataError('Неправильные данные'));
    });
};

module.exports = { getAllArticles, createArticle, deleteArticle };
