const moviesRouter = require('express').Router();
const { movieIdValidate, movieValidate } = require('../middlewares/validate');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', movieValidate, createMovie);
moviesRouter.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = moviesRouter;