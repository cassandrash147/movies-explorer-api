const NotFoundError = require('../errors/NotFoundError');

const getError = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

module.exports = getError;
