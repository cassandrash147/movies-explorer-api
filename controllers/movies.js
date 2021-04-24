const movieModel = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const { messages } = require('../config/messages');

const getMovies = (req, res, next) => movieModel.find({})
  .then((movies) => res.status(200).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const ownerId = req.user._id;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: ownerId,
  })
  // вернём записанные в базу данные
    .then((movie) => res.send(movie))
  // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.validationFalied));
        return;
      }

      next(err);
    });
};

const deleteMovie = (req, res, next) => movieModel.findByIdAndRemove(req.params.movieId)

  .then((movie) => {
    if (!movie) {
      throw new NotFoundError(messages.movieNotExist);
    } else if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError(messages.someonEelsesMovie);
    }
    movieModel.deleteOne({ _id: req.params.id })
      .then((removedMovie) => res.status(200).send(removedMovie));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(messages.сastError));
      return;
    }
    next(err);
  });

module.exports = {
  getMovies, createMovie, deleteMovie,
};
