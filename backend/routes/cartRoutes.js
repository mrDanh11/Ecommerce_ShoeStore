const express = require('express')
const router = express.Router()
const {getCartItem, postCartItem, updateCartItem, deleteCartItem } = require('../controllers/cartController')

router.get('/cart/:customerId', getCartItem)
router.post('/cart/:customerId', postCartItem)
router.put('/cart/:customerId/:itemId', updateCartItem)
router.delete('/cart/:customerId/:itemId', deleteCartItem)

module.exports = router;