const express = require('express');
const authController = require('./auth.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));

module.exports = router;