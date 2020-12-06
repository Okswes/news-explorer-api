const user = require('express').Router();

const { userInfo } = require('../controllers/user');

user.get('/me', userInfo);

module.exports = user;
