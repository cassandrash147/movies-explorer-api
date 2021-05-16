const bcrypt = require('bcryptjs');
const jwtAuth = require('jsonwebtoken');
const userModel = require('../models/user');
require('dotenv').config();

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { jwt, pass } = require('../config/devConfig');
const {
  JWT_SECRET,
  SALT,
  EXPIRES,
  NODE_ENV,
} = require('../config/processConfig');
const { messages } = require('../config/messages');

const getCurrentUser = (req, res, next) => {
  userModel.findOne({ _id: req.user._id }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError(messages.userNotFound);
      }
      return res.status(200).send({ _id: user._id, name: user.name, email: user.email });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, NODE_ENV === 'production' ? Number(SALT) : pass.salt)
    .then((hash) => userModel.create({
      name, email, password: hash,
    }))

    // вернём записанные в базу данные
    .then((user) => res.status(201).send({ _id: user._id, name: user.name, email: user.email }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(messages.validationFalied);
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(messages.userAlreadyExists);
      }

      next(err);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  userModel.findOne({ email: req.body.email })
    .then(() => {
      const { name, email } = req.body;
      userModel.findByIdAndUpdate(req.user._id, { name, email },
        { new: true, runValidators: true })
        // вернём записанные в базу данные
        .then((newuser) => {
          if (!newuser) {
            throw new BadRequestError(messages.userNotFound);
          }

          return res.status(200).send(
            { _id: newuser._id, name: newuser.name, email: newuser.email },
          );
        })

        // данные не записались, вернём ошибку
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(messages.validationFalied));
            return;
          } if (err.name === 'CastError') {
            next(new BadRequestError(messages.userNotFound));
          } if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictError(messages.userAlreadyExists));
            return;
          }

          next(err);
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwtAuth.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwt.secretKey,
        { expiresIn: NODE_ENV === 'production' ? (Number(EXPIRES)) : jwt.expiresIn });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации

      next(new UnauthorizedError(err.message));
    });
};

module.exports = {
  getCurrentUser, createUser, updateProfile, login,
};
