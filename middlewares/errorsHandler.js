const {
  isCelebrateError,
} = require('celebrate');

const errorHandling = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    return res.status(400).send({ message: err.message });
  }
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  next(err);
  return res.status(500).send({ message: err.message });
};

module.exports = {
  errorHandling,
};
