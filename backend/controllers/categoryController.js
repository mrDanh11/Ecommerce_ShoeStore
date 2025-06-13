const Category = require('../models/categoryModel');
const Product = require('../models/productModel'); 
const { search } = require('../routes/productRoutes');

const getCategories = async (req, res) => {
    const { limit, offset, search } = req.body;
    try {
        const categories = await Category.getCategories(
            parseInt(limit) || 10,
            parseInt(offset) || 0,
            search || ''
        );
        res.status(200).json({
            errorCode: 0,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
}

const getCategoryCount = async (req, res) => {
    const { search } = req.body;
    try {
        const count = await Category.getCategoryCount(search || '');
        res.status(200).json({
            errorCode: 0,
            count
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
}

const insertCategory = async (req, res) => {
    const { name, saleOffId } = req.body;
    try {
        if (!name || name.trim() === "") {
            return res.status(400).json({
                errorCode: -1,
                error: 'Category name is required'
            });
        }
        // Check if category name already exists
        const search = name.trim();
        const existingCategory = await Category.getCategories(1, 0, search);
        if (existingCategory.length > 0) {
            return res.status(400).json({
                errorCode: -1,
                error: 'Category name already exists'
            });
        }
        const newCategory = await Category.insertCategory(name, saleOffId);
        res.status(201).json({
            errorCode: 0,
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;
    console.log('Deleting category with ID:', categoryId);
    try {
        const products = await Product.getProducts(1000, 0, { category_id: categoryId });
        console.log('Products to delete:', products);
        for (const product of products) {
            await Product.deleteProduct(product.masanpham);
        }
        const deletedCategory = await Category.deleteCategory(categoryId);
        res.status(200).json({
            errorCode: 0,
            data: deletedCategory
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, saleOffId } = req.body;
    try {
        //check if name is existing but not the same as current category name
        if (name) {
            const search = name.trim();
            const existingCategory = await Category.getCategories(1, 0, search);
            if (existingCategory.length > 0 && existingCategory[0].madanhmuc !== categoryId) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Category name already exists'
                });
            }
        }
        const updatedCategory = await Category.updateCategory(categoryId, { name, saleOffId });
        res.status(200).json({
            errorCode: 0,
            data: updatedCategory
        });
    }
    catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
}

module.exports = {
    getCategories,
    getCategoryCount,
    insertCategory,
    deleteCategory,
    updateCategory
};