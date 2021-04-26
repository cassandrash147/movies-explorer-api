require('dotenv').config();
const jwtAuth = require('jsonwebtoken');
const { jwt } = require('../config/devConfig');
const {
  JWT_SECRET,
  NODE_ENV,
} = require('../config/processConfig');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { messages } = require('../config/messages');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new UnauthorizedError(messages.authorizationRequired));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwtAuth.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwt.secretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw next(new UnauthorizedError(err.message));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
