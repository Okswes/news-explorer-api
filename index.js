require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { usersRouter, articlesRouter } = require('./routes/index.js');
const auth = require('./middlewares/auth.js');
const errorChecker = require('./middlewares/errorchecker');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');

const app = express();
const { PORT = 3000, DBURL } = process.env;

mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/users/', usersRouter);
app.use('/articles/', articlesRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorChecker);

app.listen(PORT, () => {
});
