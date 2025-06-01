const express = require('express')
const router = express.Router()
const {getCartItem} = require('../controllers/cartController')

router.get('/cart/', getCartItem)
router.get('/cart/:customerId', getCartItem)
// router.post('/cart/:customerId/items', postCartItem)
// router.put('/cart/:customerId/items/:itemId', putCartItem)
// router.delete('/cart/:customerId/items/:itemId, deleteCartItem)

module.exports = router;