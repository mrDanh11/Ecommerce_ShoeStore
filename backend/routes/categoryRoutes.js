const express = require('express');
const router = express.Router();

const { getCategories, getCategoryCount, insertCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
router.get('/', getCategories);
router.get('/count', getCategoryCount);
router.post('/', insertCategory); // For adding new categories
router.delete('/:categoryId', deleteCategory); // For deleting a category by ID
router.put('/:categoryId', updateCategory); // For updating a category by ID

module.exports = router;