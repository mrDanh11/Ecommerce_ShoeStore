const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const promotionController = require('../controllers/promotionController');

// Middleware xác thực và phân quyền
const adminAccess = [
  verifyToken, 
  roleMiddleware('admin')
];

// Quản lý người dùng
router.get('/users', adminAccess, adminController.getUsers);
router.put('/users/:id', adminAccess, adminController.updateUser);
router.delete('/users/:id', adminAccess, adminController.deleteUser);

//Thống kê doanh thu
router.get('/invoices', adminAccess, adminController.getInvoices);

// Quản lý khuyến mại
router.get('/promotions', promotionController.getPromotions);
router.post('/promotions', promotionController.createPromotion);
router.put('/promotions/:id', promotionController.updatePromotion);
router.delete('/promotions/:id', promotionController.deletePromotion);

module.exports = router;
