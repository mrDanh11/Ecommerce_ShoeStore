const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Xác thực bắt buộc
const requireAuth = authMiddleware.verifyToken;

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oauth', authController.oauthLogin);

router.get('/getme', requireAuth, authController.getMe);
router.put('/update', requireAuth, authController.updateProfile);
router.post('/changepassword', requireAuth, authController.changePassword);

router.post('/logout', authController.logout);

module.exports = router;
