const router = require('express').Router();
const AuthController = require('../controllers/authController');
const TelegramController = require('../controllers/telegramController');
const checkBody = require('../middleware/checkBody');

const { verifyRefreshToken } = require('../middleware/verifyTokens');

router.post('/register', checkBody, AuthController.register);
router.post('/login', checkBody, AuthController.login);
router.get('/logout', verifyRefreshToken, AuthController.logout);
router.get('/refresh', verifyRefreshToken, AuthController.refreshTokens);

router.post('/telegram/register', TelegramController.registerViaTelegram);
router.post('/telegram/login', TelegramController.loginViaTelegram);

module.exports = router;
