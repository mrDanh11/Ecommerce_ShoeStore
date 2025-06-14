const express = require('express')
const router = express.Router()
const {getCartItem, postCartItem, updateCartItem, deleteCartItem } = require('../controllers/cartController')

router.get('/:customerId', getCartItem)
router.post('/:customerId', postCartItem)
router.put('/:customerId/:itemId', updateCartItem)
router.delete('/:customerId/:itemId', deleteCartItem)

module.exports = router;