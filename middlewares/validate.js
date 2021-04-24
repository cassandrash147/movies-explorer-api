const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const messages = require('../config/messages');

const urlValidator = (url,
  helpers) => (validator.isURL(url) ? url : helpers.message(messages.incorrectUrl));

const userCreateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const userLoginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const userUpdateValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator, messages.incorrectUrl),
    trailer: Joi.string().required().custom(urlValidator, messages.incorrectUrl),
    thumbnail: Joi.string().required().custom(urlValidator, messages.incorrectUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  movieIdValidate, userCreateValidate, userLoginValidate, movieValidate, userUpdateValidate,
};
