const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err.js');
const WrongDataError = require('../errors/wrong-data-err.js');
const EmailError = require('../errors/email-err.js');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(() => { throw new NotFoundError('Нет пользователя с таким id'); })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.code === 11000) { next(new EmailError('Пользователь с таким email уже есть')); } else { next(new WrongDataError('Неправильные данные')); }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};

module.exports = {
  getUser, createUser, login,
};
