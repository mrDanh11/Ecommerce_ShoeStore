const Product = require('../models/productModel2')

const getProduct = async (req, res) =>{
    try {
        const products = await Product.getAllProduct()

        res.status(200).json({
            errorCode: 0,
            data: products
        })
    } catch (error) {
        res.status(500).json({
            errorCode: -1,
            error: error.message
        })
    }
}

module.exports = {getProduct}