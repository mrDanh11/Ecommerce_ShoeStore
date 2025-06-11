const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Middleware xác thực và phân quyền
const adminAccess = [
  authMiddleware, 
  roleMiddleware('admin')
];

// Quản lý người dùng
router.get('/users', adminAccess, adminController.getUsers);
router.put('/users/:id', adminAccess, adminController.updateUser);
router.delete('/users/:id', adminAccess, adminController.deleteUser);

module.exports = router;