const router = require('express').Router();
const supabase = require('../config/supabaseClient');
const { checkout, listUserOrder } = require('../controllers/orderController')

// thanh toán sp trong giỏ hàng
router.post('/checkout', checkout)
// thanh toán sp ngoài màn hình
router.post('/order', checkout)

// user
router.get('/order/userorder/:customerId', listUserOrder)
module.exports = router;
