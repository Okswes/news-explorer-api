const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    return res.status(401).send({ message: 'Введены некорректные данные!' });
  }
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован!' });
  }
  return res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = errorsHandler;
