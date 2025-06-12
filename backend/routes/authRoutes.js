const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Đăng nhập bằng Google
router.post('/oauth', authController.oauthLogin);

// Đổi mật khẩu
router.put('/change-password', authMiddleware, authController.changePassword);

// Lấy thông tin user hiện tại
router.get('/me', authMiddleware, authController.getMe);

// Đăng xuất
router.post('/logout', authController.logout);

module.exports = router;
