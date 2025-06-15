const Products = require('../models/productModel')

const getProducts = async (req, res) => {
    const { limit, offset, filters } = req.body;
    console.log('Filters:', filters);
    console.log('Limit:', limit);
    console.log('Offset:', offset);
    try {
        const products = await Products.getProducts(
            parseInt(limit) || 10,
            parseInt(offset) || 0,
            filters ? JSON.parse(filters) : {}
        );

        res.status(200).json({
            errorCode: 0,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const getProductCount = async (req, res) => {
    const { filters } = req.body;
    try {
        const count = await Products.getProductCount(filters ? JSON.parse(filters) : {});
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
};

const insertProduct = async (req, res) => {
    const { name, desc, img, price, categoryId, status, detailsData } = req.body;
    try {
        const existingProduct = await Products.getProducts(1, 0, { search: name });
        if (!existingProduct || existingProduct.length === 0) {
            const newProduct = await Products.insertProduct(
                productData = {
                    name,
                    desc,
                    img,
                    price,
                    categoryId,
                    status
                },
                detailsData ? detailsData[0] : {}
            );
            if (!newProduct) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Failed to insert product'
                });
            }
            res.status(201).json({
                errorCode: 0,
                data: newProduct
            });
        } else {
            const { color, size, quantity } = detailsData ? detailsData[0] : {};

            const existingDetail = await Products.getProducts(1, 0, {
                search: name,
                CnS: {
                    color,
                    size
                }
            });

            if (existingDetail && existingDetail.length > 0) {
                const updatedQuantity = existingDetail[0].chitietsanpham[0].soluong + parseInt(quantity);
                const detailId = existingDetail[0].chitietsanpham[0].machitietsanpham; 
                const updatedProduct = await Products.updateProduct(
                    existingProduct[0].masanpham,
                    {},
                    { 
                        detailsId: detailId,
                        quantity: updatedQuantity 
                    },
                );             
                
                if (!updatedProduct) {
                    return res.status(400).json({
                        errorCode: -1,
                        error: 'Failed to update product detail'
                    });
                }

                res.status(200).json({
                    errorCode: 0,
                    data: updatedProduct
                });
            } else {
                const newDetail = await Products.insertProduct(
                    {},
                    {
                        color,
                        size,
                        quantity,
                        productId: existingProduct[0].masanpham,
                        dPrice: price
                    }
                )

                if (!newDetail) {
                    return res.status(400).json({
                        errorCode: -1,
                        error: 'Failed to insert product detail'
                    });
                }

                res.status(201).json({
                    errorCode: 0,
                    data: newDetail
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const deletedProduct = await Products.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                errorCode: -1,
                error: 'Product not found'
            });
        }
        res.status(200).json({
            errorCode: 0,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, desc, img, price, categoryId, status, detailUpdate } = req.body;
    const productUpdate = {
        name,
        desc,
        img,
        price,
        categoryId,
        status
    }
    try {
        if (productUpdate.name) {
            const existingProductName = await Products.getProducts(1, 0, { search: productUpdate.name });
            if (existingProductName && existingProductName.length > 0 && existingProductName[0].masanpham !== productId) {
                return res.status(400).json({
                    errorCode: -1,
                    error: 'Product name already exists'
                });
            }
        }
        const updatedProduct = await Products.updateProduct(
            productId,
            {
                ...productUpdate
            },
            detailUpdate ? detailUpdate[0] : {}
        );
        if (!updatedProduct) {
            return res.status(400).json({
                errorCode: -1,
                error: 'Failed to update product'
            });
        }
        res.status(200).json({
            errorCode: 0,
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

module.exports = { getProducts, getProductCount, insertProduct, deleteProduct, updateProduct };