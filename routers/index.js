const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');

const auth = require('../middlewares/auth');
const { userValidate } = require('../middlewares/validate');
const { createUser, login } = require('../controllers/users');

// роуты, не требующие авторизации
router.post('/signin', userValidate, login);

router.post('/signup', userValidate, createUser);

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

module.exports = router;
