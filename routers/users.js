const usersRouter = require('express').Router();
const { userUpdateValidate } = require('../middlewares/validate');
const { getCurrentUser, updateProfile } = require('../controllers/users');

usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', userUpdateValidate, updateProfile);

module.exports = usersRouter;
