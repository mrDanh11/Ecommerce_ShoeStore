const Cart = require('../models/cartModel')

// lấy tất cả sản phẩm trong giỏ hàng của kahsch hàng
const getCartItem = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const data = await Cart.getCartItem(customerId)

        return res.status(200).json({
            errorCode: 1,
            data: data
        })
    } catch (error) {
        console.log('Lỗi getCartItem: ', error)
    }
}


module.exports = { getCartItem }