const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oauth', authController.oauthLogin);
router.get('/getme', authMiddleware.verifyToken, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
