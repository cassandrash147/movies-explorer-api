const routerErr = require('express').Router();
const getError = require('../controllers/error');

routerErr.use('/*', getError);

module.exports = routerErr;
