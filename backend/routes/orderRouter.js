const router = require('express').Router();
const supabase = require('../config/supabaseClient'); // Đảm bảo bạn đã cấu hình Supabase Client đúng
const { checkout } = require('../controllers/orderController')

// thanh toán sp trong giỏ hàng
router.post('/checkout', checkout)
// thanh toán sp ngoài màn hình
router.post('/order', checkout)

module.exports = router;
