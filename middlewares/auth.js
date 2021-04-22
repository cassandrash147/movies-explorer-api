require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new UnauthorizedError('Нет токена или либо он начинается не с Bearer'));
  }
  const token = authorization.replace('Bearer ', '');
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправим ошибку, если не получилось
    throw next(new UnauthorizedError(err));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
