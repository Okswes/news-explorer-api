const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InvalidDataError = require('../errors/invalid-data-error');
const NotFoundError = require('../errors/not-found-err');

const user = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { name, password, email } = req.body;
  if (req.body.password.length < 8) {
    throw new InvalidDataError('Длина пароля меньше 8 символов!');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      user.create({
        name,
        email,
        password: hash,
      })
        .then((data) => {
          res.send({
            name: data.name,
            email: data.email,
          });
        })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findUserByCredentials(email, password)
    .then((data) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.userInfo = (req, res, next) => {
  user.findOne({ _id: req.user._id })
    .orFail(() => new NotFoundError('Такого пользователя нет!'))
    .then((data) => res.send({ name: data.name, email: data.email }))
    .catch(next);
};
