const {
  isCelebrateError,
} = require('celebrate');
const messages = require('../config/messages');

const errorHandling = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    return res.status(400).send(err.message);
  }
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? messages.internalServerError
        : message,
    });
  return next();
};

module.exports = {
  errorHandling,
};
