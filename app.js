require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const { createUser, login } = require('./controllers/user');
const { user, article } = require('./routes/index');

//  схемы для celebrate
const signupSchema = require('./schemas/signupSchema');
const tokenSchema = require('./schemas/tokenSchema');
const signinSchema = require('./schemas/signinSchema');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

mongoose.connect('mongodb://localhost:27017/news', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(helmet());

// подключаем мидлвэр bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
app.use(requestLogger);

// роуты для пост запросов регистрация и логин
app.post('/signup', celebrate(signupSchema), createUser);
app.post('/signin', celebrate(signinSchema), login);

// используем миддлвэр для защиты роутов
app.use(celebrate(tokenSchema), auth);

app.use('/users', user);
app.use('/articles', article);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// обработчик ошибок
app.use(errorsHandler);

app.listen(PORT);
