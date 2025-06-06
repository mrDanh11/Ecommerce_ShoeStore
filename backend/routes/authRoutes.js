const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

// Đổi mật khẩu
router.put('/change-password', authMiddleware, authController.changePassword);

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, authController.getMe);

// Đăng xuất
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
