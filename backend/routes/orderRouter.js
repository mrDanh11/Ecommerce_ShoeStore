const router = require('express').Router();
const supabase = require('../config/supabaseClient');
const { checkout, listUserOrder, allOrder } = require('../controllers/orderController')

// thanh toán sp trong giỏ hàng
router.post('/checkout', checkout)
// thanh toán sp ngoài màn hình
router.post('/', checkout)

// user
router.get('/userorder/:customerId', listUserOrder) // khong filter
router.post('/userorder/', allOrder)   // có filter -> phải truyền customerId qua body

// admin: tra cứu: xem lích sử đơn hàng và trạng thái
router.post('/list', allOrder)

module.exports = router;
