const Category = require('../models/categoryModel');
const Product = require('../models/productModel'); 

const getCategories = async (req, res) => {
    const { limit, offset, categoryId, search, saleOffId } = req.query;
    try {
        // Validate limit parameter
        let validLimit = 10; // default
        if (limit !== undefined) {
            const parsedLimit = parseInt(limit);
            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid limit parameter. Must be a positive integer.'
                });
            }
            validLimit = parsedLimit;
        }

        // Validate offset parameter
        let validOffset = 0; // default
        if (offset !== undefined) {
            const parsedOffset = parseInt(offset);
            if (isNaN(parsedOffset) || parsedOffset < 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid offset parameter. Must be a non-negative integer.'
                });
            }
            validOffset = parsedOffset;
        }

        // Build filters object from individual parameters
        let validFilters = {};
        
        // Validate and add categoryId to filters
        if (categoryId !== undefined) {
            const parsedCategoryId = parseInt(categoryId);
            if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid categoryId parameter. Must be a positive integer.'
                });
            }
            validFilters.categoryId = parsedCategoryId;
        }

        // Validate and add search to filters
        if (search !== undefined) {
            if (typeof search !== 'string' || search.trim() === '') {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid search parameter. Must be a non-empty string.'
                });
            }
            validFilters.search = search.trim();
        }

        // Validate and add saleOffId to filters
        if (saleOffId !== undefined) {
            const parsedSaleOffId = parseInt(saleOffId);
            if (isNaN(parsedSaleOffId) || parsedSaleOffId <= 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid saleOffId parameter. Must be a positive integer.'
                });
            }
            validFilters.saleOffId = parsedSaleOffId;
        }

        const categories = await Category.getCategories(validLimit, validOffset, validFilters);
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
    const { categoryId, search, saleOffId } = req.query;
    try {
        // Build filters object from individual parameters
        let validFilters = {};
        
        // Validate and add categoryId to filters
        if (categoryId !== undefined) {
            const parsedCategoryId = parseInt(categoryId);
            if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid categoryId parameter. Must be a positive integer.'
                });
            }
            validFilters.categoryId = parsedCategoryId;
        }

        // Validate and add search to filters
        if (search !== undefined) {
            if (typeof search !== 'string' || search.trim() === '') {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid search parameter. Must be a non-empty string.'
                });
            }
            validFilters.search = search.trim();
        }

        // Validate and add saleOffId to filters
        if (saleOffId !== undefined) {
            const parsedSaleOffId = parseInt(saleOffId);
            if (isNaN(parsedSaleOffId) || parsedSaleOffId <= 0) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Invalid saleOffId parameter. Must be a positive integer.'
                });
            }
            validFilters.saleOffId = parsedSaleOffId;
        }

        const count = await Category.getCategoryCount(validFilters);
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