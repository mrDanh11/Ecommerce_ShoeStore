const express = require('express')
const router = express.Router()

const {getProduct} = require('../controllers/productController')

// api: http://localhost:4004/products
router.get('/products', getProduct )

module.exports = router