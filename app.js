const express = require('express');

const {
  isCelebrateError,
} = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routers/index');
const options = require('./config/corsoptions');

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

const BadRequestError = require('./errors/BadRequestError');
const handleResourceNotFound = require('./middlewares/handleResourceNotFound');
const { server, db } = require('./config/devConfig');
const {
  NODE_ENV,
  PORT,
  MONGO_URL,
} = require('./config/processConfig');

const mongoDB = NODE_ENV === 'production' ? MONGO_URL : db.local;

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Массив разешённых доменов
const { rateLimitConfig, slowDownConfig } = require('./config/limitConfig');

const limiter = rateLimit(rateLimitConfig);
const speedLimiter = slowDown(slowDownConfig);

app.use(cors(options), limiter, speedLimiter, helmet());
app.use(bodyParser.json());
app.use(requestLogger); app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router, handleResourceNotFound);
const celebrateErrorHandling = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    next(new BadRequestError('Введенные данные не корректны'));
  }

  next(err);
};

// обработчики ошибок
app.use(errorLogger);
app.use(celebrateErrorHandling);
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? message
        : message,
    });
  next();
});

app.listen(NODE_ENV === 'production' ? PORT : server.port, () => {

});
