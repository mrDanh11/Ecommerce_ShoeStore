const Cart = require('../models/cartModel')

// lấy tất cả sản phẩm trong giỏ hàng của kahsch hàng
const getCartItem = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const data = await Cart.getCartItem(customerId)

        return res.status(200).json({
            success: true,
            errorCode: 1,
            data: data
        })
    } catch (error) {
        console.log('Lỗi getCartItem: ', error)
        res.status(500).json({
            success: false,
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
        return res.status(400).json({ error: 'Thiếu masanpham hoặc soluong' });
    }

    try {
        const result = await Cart.addOrUpdateCartItem(customerId, masanpham, soluong);
        res.status(200).json({
            message: "Add product to cart successfull",
            errorCode: 1,
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({ success: false ,error: result.error });
    }
}

const updateCartItem = async (req, res) => {
    const { customerId, itemId } = req.params;
    const { size, color, soluong } = req.body;
  
    try {
      // 1. lấy giỏ hàng của customerId
      const { cart, error: errCart } = await Cart.getCartByCustomer(customerId);
      if (errCart || !cart) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy giỏ hàng của khách' });
      }
      const cartId = cart.magiohang;
  
      // 2. Lấy dòng item hiện tại trong ChiTietGioHang theo itemId || getCartItemById --> { cartItem: Array, error }
      const { cartItem, error: errItem } = await Cart.getCartItemById(itemId);
      if (errItem || !Array.isArray(cartItem) || cartItem.length === 0) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm trong giỏ' });
      }
      
    // check xem sanpham này có phải thuộc giỏ hàng ko??
      const existingItem = cartItem[0];
      if (existingItem.magiohang !== cartId) {
        return res.status(404).json({ success: false, error: 'Sản phẩm không thuộc giỏ hàng này' });
      }
  
      // 3. lấy sp trong ChiTietSanPham -> để biết masanpham và giá gốc
      const { productItem: oldProductItem, error: errOldProd } = await Cart.getProductItemById(
        existingItem.machitietsanpham
      );
      if (errOldProd || !oldProductItem) {
        return res.status(400).json({ success: false, error: 'Dữ liệu sản phẩm trong ChiTietSanPham không hợp lệ' });
      }
      const productId = oldProductItem.masanpham;
  
      // 4. tìm sản phẩm mới (productId, size, color)
      const { productItem: newProductCandidates, error: errNewProd } =
        await Cart.getProductItemByAttributes(productId, size, color);
      if (errNewProd) {
        return res.status(500).json({ success: false, error: 'Lỗi khi tìm sản phẩm mới' });
      }
      if (!Array.isArray(newProductCandidates) || newProductCandidates.length === 0) {
        return res.status(400).json({ success: false, error: 'Không tìm thấy sản phẩm phù hợp (size/color)' });
      }
      const newProductItem = newProductCandidates[0];
      const newVariantId = newProductItem.machitietsanpham;

    // 4.1 ktra soluong có đủ trong chitietsanpham khong?
    if(soluong > newProductItem.soluong)
        return res.status(400).json({ success: false, error: 'Số lượng sản phẩm không đủ !!' }); 
  
      // 5. ktra xem sản phẩm mới đã tồn tại trong giỏ chưa
      const { cartItemExists: duplicateItem, error: errDup } =
        await Cart.checkCartItemByCartId_ProductItemId(cartId, newVariantId);
      if (errDup && errDup.code !== 'PGRST116') {
        throw errDup;
      }
  
      // 6. nếu duplicate tồn tại → update lại số lượng, haowjc xoá dongg cũ
      if (duplicateItem) {
        const updatedQty = soluong;
        const { error: errUpdateDup } = await Cart.updateCartItemQuantity(
          duplicateItem.machitietgiohang,
          updatedQty
        );
        if (errUpdateDup) throw errUpdateDup;
  
        // 6a. nếu existingItem khác duplicate → xóa existingItem
        if (existingItem.machitietgiohang !== duplicateItem.machitietgiohang) {
          const { error: errDel } = await Cart.deleteCartItem(existingItem.machitietgiohang);
          if (errDel) throw errDel;
        }
      } else {
        // 7. nếu chưa tồn tại → cập nhật sản phẩm mới + số lượng cho existingItem
        const { error: errUpdate } = await Cart.updateCartItemProductItemAndQuantity(
          existingItem.machitietgiohang,
          newVariantId,
          soluong
        );
        if (errUpdate) throw errUpdate;
      }
  
      // 8. get all item in cart to get total_amount
      const { items: allItems, error: errAllItems } = await Cart.getAllCartItems(cartId);
      if (errAllItems) throw errAllItems;
  
      const tongsoluong = allItems.reduce((sum, it) => sum + it.soluong, 0);
      const totalamount = allItems.reduce(
        (sum, it) =>
          sum + it.soluong * (it.machitietsanpham?.gia !== undefined ? it.machitietsanpham.gia : 0),
        0
      );
  
      // 9. update lại trong giỏ hàng
      const { error: errUpdateCart } = await Cart.updateCartTotals(cartId, tongsoluong, totalamount);
      if (errUpdateCart) throw errUpdateCart;
  
      return res.json({
        success: true,
        message: 'Cập nhật giỏ hàng thành công',
        data: {
          magiohang: cartId,
          machitietgiohang: duplicateItem
            ? duplicateItem.machitietgiohang
            : existingItem.machitietgiohang,
          soluong: duplicateItem ? duplicateItem.soluong + soluong : soluong,
          size,
          color,
          tongsoluong,
          totalamount
        }
      });
    } catch (error) {
      console.error('Lỗi trong updateCartItem:', error);
      return res.status(500).json({ success: false, error: error.message || 'Lỗi hệ thống' });
    }
  };


const deleteCartItem = async (req, res) => {
    const {customerId, itemId} = req.params;
    console.log('check req.params: ', req.params)

    try {
        
    } catch (error) {
        console.log('Lỗi deleteCartItem: ', error)
        return res.status(500).json({
            errorCode: -1,
            success: false,
            error: error.message
        })
    }

}



module.exports = { getCartItem, postCartItem, updateCartItem, deleteCartItem }