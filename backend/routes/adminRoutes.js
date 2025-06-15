const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Middleware xác thực và phân quyền
const adminAccess = [
  verifyToken, 
  roleMiddleware('admin')
];

// Quản lý người dùng
router.get('/users', adminAccess, adminController.getUsers);
router.put('/users/:id', adminAccess, adminController.updateUser);
router.delete('/users/:id', adminAccess, adminController.deleteUser);

module.exports = router;
