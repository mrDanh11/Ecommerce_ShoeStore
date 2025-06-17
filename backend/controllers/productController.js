const Products = require('../models/productModel')

const getProducts = async (req, res) => {
    // Lấy parameters từ query string thay vì body
    const {
        limit = 10,
        offset = 0,
        search,
        categoryId,
        minPrice,
        maxPrice,
        isAvailable,
        color,
        size,
    } = req.query;

    console.log('Query params:', req.query);

    try {
        // Validate và xây dựng filters object
        const filters = {
            CnS: {}
        };

        if (search && search.trim()) {
            filters.search = search.trim();
        }

        if (categoryId) {
            const catId = parseInt(categoryId);
            if (!isNaN(catId) && catId > 0) {
                filters.categoryId = catId;
            }
        }

        if (minPrice) {
            const min = parseFloat(minPrice);
            if (!isNaN(min) && min >= 0) {
                filters.minPrice = min;
            }
        }

        if (maxPrice) {
            const max = parseFloat(maxPrice);
            if (!isNaN(max) && max >= 0) {
                filters.maxPrice = max;
            }
        }

        if (isAvailable !== undefined) {
            filters.isAvailable = isAvailable;
        }

        if (color && color.trim()) {
            filters.CnS.color = color.trim();
        }

        if (size && size.trim()) {
            filters.CnS.size = parseInt(size.trim());
        }

        // Validate limit và offset
        const validatedLimit = Math.min(Math.max(parseInt(limit), 1), 100); // Max 100 items
        const validatedOffset = Math.max(parseInt(offset), 0);

        const products = await Products.getProducts(
            validatedLimit,
            validatedOffset,
            filters
        );

        res.status(200).json({
            errorCode: 0,
            data: products,
            pagination: {
                limit: validatedLimit,
                offset: validatedOffset,
                total: products.length
            }
        });
    } catch (error) {
        console.error('Error in getProducts:', error);
        res.status(500).json({
            errorCode: -1,
            error: error.message
        });
    }
};

const getProductCount = async (req, res) => {
    // Lấy filters từ query parameters
    const {
        search,
        categoryId,
        minPrice,
        maxPrice,
        isAvailable,
        color,
        size
    } = req.query;

    try {
        // Validate và xây dựng filters object (tương tự getProducts)
        const filters = {
            CnS: {}
        };

        if (search && search.trim()) {
            filters.search = search.trim();
        }

        if (categoryId) {
            const catId = parseInt(categoryId);
            if (!isNaN(catId) && catId > 0) {
                filters.categoryId = catId;
            }
        }

        if (minPrice) {
            const min = parseFloat(minPrice);
            if (!isNaN(min) && min >= 0) {
                filters.minPrice = min;
            }
        }

        if (maxPrice) {
            const max = parseFloat(maxPrice);
            if (!isNaN(max) && max >= 0) {
                filters.maxPrice = max;
            }
        }

        if (isAvailable !== undefined) {
            filters.isAvailable = isAvailable;
        }

        if (color && color.trim()) {
            filters.CnS.color = color.trim();
        }

        if (size && size.trim()) {
            filters.CnS.size = size.trim();
        }

        const count = await Products.getProductCount(filters);

        res.status(200).json({
            errorCode: 0,
            count: count || 0
        });
    } catch (error) {
        console.error('Error in getProductCount:', error);
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

const getProductItemById = async (req, res) => {
    const { productItemId } = req.params
    console.log('check customerId: ', productItemId)
    console.log('check req.params: ', req.params)

    try {
        const { data, error } = await Products.getProductItemById(productItemId)
        res.status(200).json({
            success: true,
            errorCode: 1,
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            errorCode: -1,
            data: null
        })
    }
}

const getProductById = async (req, res) => {
    const { productId } = req.params
    console.log('check customerId: ', productId)
    console.log('check req.params: ', req.params)

    try {
        const { data, error } = await Products.getProductById(productId)
        res.status(200).json({
            success: true,
            errorCode: 1,
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            errorCode: -1,
            data: null
        })
    }
}

module.exports = { getProducts, getProductCount, insertProduct, deleteProduct, updateProduct, getProductItemById, getProductById };