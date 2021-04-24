const NotFoundError = require('../errors/NotFoundError');
const { messages } = require('../config/messages');

const getError = (req, res, next) => {
  next(new NotFoundError(messages.resourceNotFound));
};

module.exports = getError;
