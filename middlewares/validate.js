const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidator = (url, helpers) => (validator.isURL(url) ? url : helpers.message('Некоректный Url'));

const userValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator, 'URL validation.'),
    trailer: Joi.string().required().custom(urlValidator, 'URL validation.'),
    thumbnail: Joi.string().required().custom(urlValidator, 'URL validation.'),
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
  movieIdValidate, userValidate, movieValidate,
};
