const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');

const auth = require('../middlewares/auth');
const { userCreateValidate, userLoginValidate } = require('../middlewares/validate');
const { createUser, login } = require('../controllers/users');

const getError = require('../controllers/error');

// роуты, не требующие авторизации
router.post('/signin', userLoginValidate, login);

router.post('/signup', userCreateValidate, createUser);

// роуты, требующие авторизации
router.use(auth);
router.use('/', auth, userRouter);

router.use('/', auth, movieRouter);
router.use('*', getError);
module.exports = router;
