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
        res.status(500).json({
            error: error.message
        })
    }
}

// thêm sản phẩm vào giỏ hàng
const postCartItem = async (req, res) => {
    const { customerId } = req.params;
    const { masanpham, soluong } = req.body;
    // console.log('check customerId: ', customerId)
    // console.log('check req.body: ', req.body)

    if (!masanpham || !soluong) {
        return res.status(400).json({ error: 'Lack of masanpham or soluong' });
    }

    try {
        const result = await Cart.addOrUpdateCartItem(customerId, masanpham, soluong);
        res.status(200).json({
            message: "Add product to cart successfull",
            errorCode: 1,
            data: result
        })
    } catch (error) {
        res.status(500).json({ error: result.error });
    }

}




module.exports = { getCartItem, postCartItem }