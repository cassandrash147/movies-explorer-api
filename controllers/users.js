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

const getCurrentUser = (req, res, next) => {
  userModel.findOne({ _id: req.user._id }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError(`Пользователь не найден ${req.user._id}`);
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, NODE_ENV === 'production' ? Number(SALT) : pass.salt)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))

    // вернём записанные в базу данные
    .then((user) => res.status(201).send(user))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
        return;
      }

      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
        return;
      }

      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (userModel.findUserByCredentials(email)) {
    throw new BadRequestError('Пользователь с такой почтой уже зарегестрирован. Укажите другой email или перелогиньтесь');
  }
  userModel.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    // вернём записанные в базу данные
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Нет пользователя с таким id. Нельзя изменить несущетсвуещего пользователя');
      }

      return res.status(200).send(user);
    })

    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`Ошибка валидации ${err.message}`));
        return;
      } if (err.name === 'CastError') {
        next(new BadRequestError('Нет пользователя с таким id. Нельзя изменить несущетсвуещего польователя'));
        return;
      }
      next(err);
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
      next(new UnauthorizedError(`Ошибка аутентификации ${err}`));
    });
};

module.exports = {
  getCurrentUser, createUser, updateProfile, login,
};
