const jwt = require('jsonwebtoken');
const WrongUserError = require('../errors/wrong-auth-err.js');

const { JWT_SECRET = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongUserError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new WrongUserError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
