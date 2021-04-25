const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routers/index');
const options = require('./config/corsoptions');
const { errorHandling } = require('./middlewares/errorsHandler');
const { messages } = require('./config/messages');

const app = express();

const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(messages.crashTest);
  }, 0);
});

app.use(cors(options), limiter, speedLimiter, helmet());
app.use(router);

// обработчики ошибок
app.use(errorLogger);
app.use(errorHandling);

app.listen(NODE_ENV === 'production' ? PORT : server.port, () => {

});
