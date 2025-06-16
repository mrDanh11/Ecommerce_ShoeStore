const express = require('express');
const router = express.Router();

const { getProducts, getProductCount, insertProduct, deleteProduct, updateProduct, getProductItemById, getProductById } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/count', getProductCount);
router.post('/', insertProduct); // For adding new products
router.delete('/:productId', deleteProduct); // For deleting a product by ID
router.put('/:productId', updateProduct); // For updating a product by ID
router.get('/item/:productItemId', getProductItemById)
router.get('/:productId', getProductById)

module.exports = router;