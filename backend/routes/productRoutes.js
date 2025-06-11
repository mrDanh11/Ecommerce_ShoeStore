const express = require('express');
const router = express.Router();

const { getProducts, getProductCount, insertProduct, deleteProduct, updateProduct } = require('../controllers/productController');

router.get('/products', getProducts);
router.get('/products/count', getProductCount);
router.post('/products', insertProduct); // For adding new products
router.delete('/products/:productId', deleteProduct); // For deleting a product by ID
router.put('/products/:productId', updateProduct); // For updating a product by ID

module.exports = router;