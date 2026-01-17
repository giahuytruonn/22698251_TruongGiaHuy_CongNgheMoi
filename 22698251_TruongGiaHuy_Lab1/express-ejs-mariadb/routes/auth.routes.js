const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { redirectIfLoggedIn } = require('../middleware/auth.middleware');

router.get('/login', redirectIfLoggedIn, AuthController.showLoginPage);
router.post('/login', AuthController.login);

router.get('/register', redirectIfLoggedIn, AuthController.showRegisterPage);
router.post('/register', AuthController.register);

router.get('/logout', AuthController.logout);

module.exports = router;
