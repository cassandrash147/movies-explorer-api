const usersRouter = require('express').Router();

const { getCurrentUser, updateProfile } = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateProfile);

module.exports = usersRouter;
