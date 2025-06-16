const supabase = require('../config/supabaseClient')

const getCartItem = async (customerId) => {
    const { data, error } = await supabase.from('khachhang')
        // .select(`
        //         makhachhang, hoten,
        //         giohang(magiohang, chitietgiohang(soluong, machitietgiohang, chitietsanpham(machitietsanpham, gia, soluong, size, color, sanpham(masanpham, tensanpham, anhsanpham, gia, tinhtrang, description))
        //                     )
        //                 )
        //     `)
        .select(`
                *,
                giohang(*, chitietgiohang(*, chitietsanpham(*, sanpham(*))
                            )
                        )
            `)
        .eq('makhachhang', customerId)
    console.log('check data: ', data);

    if (error) {
        console.error("Error fetching data: ", error)
        return null
    }

    console.error("Error fetching data: ", data)
    return data;
}

const addOrUpdateCartItem = async (customerId, machitietsanpham, soluongMoiThem) => {
    try {
        // lay gio hang hien tai cua khasch hang
        const { data: existingCart, error: errorCart } = await supabase
            .from('giohang')
            .select('*')
            .eq('makhachhang', customerId)
            .single()

        let cart = existingCart;
        // neu chua co gio hang -> tao moi
        if (errorCart && errorCart.code === 'PGRST116') {
            const { data: newCart, errorNewCart } = await supabase
                .from('giohang')
                .insert([{ makhachhang: customerId, tongsoluong: 0, total_amount: 0 }])
                .single();

            if (errorNewCart)
                throw errorNewCart
            cart = newCart
        }
        else if (errorCart) {
            throw errorCart;
        }

        console.log('check cart: ', cart)

        // ktra sp da co trong chitietgiohang chua
        const { data: existingItem, error: errorItem } = await supabase
            .from('chitietgiohang')
            .select('*')
            .eq('magiohang', cart.magiohang)
            .eq('machitietsanpham', machitietsanpham)
            .single()

        if (errorItem && errorItem.code !== 'PGRST116')
            throw errorItem
        // neu co -> tang so luong
        if (existingItem) {
            const newQuantity = existingItem.soluong + soluongMoiThem
            
            // lấy số lượng sp này trong kho coi đủ để add vào cart ko?
            const {data: itemInProductItem, error} = await supabase.from('chitietsanpham').select('*').eq('machitietsanpham', existingItem.machitietsanpham).single()
            const quantityItemInProductItem = itemInProductItem.soluong;
            if(newQuantity > quantityItemInProductItem){
                // throw error.message("Số lượng sản phẩm này trong giỏ hàng đã vượt quá số lượng tồn trong kho")
                throw new Error(`Số lượng trong giỏ (${newQuantity}) đã vượt quá tồn kho (${quantityItemInProductItem})`);
            }

            const { error: errorUpdate } = await supabase
                .from('chitietgiohang')
                .update({ soluong: newQuantity })
                .eq('machitietgiohang', existingItem.machitietgiohang)

            if (errorUpdate)
                throw errorUpdate
        }
        else { // neu chua -> tao sp moi trong chitietdonhang
            const { error: errorInsert } = await supabase
                .from('chitietgiohang')
                .insert([{ magiohang: cart.magiohang, soluong: soluongMoiThem, machitietsanpham: machitietsanpham }])

            if (errorInsert)
                throw errorInsert
        }

        // lay lai toan bo san pham trong gio hang --> de tinh tong tien va tong so luong
        const { data: allItems, error: errorAllItems } = await supabase
            .from('chitietgiohang')
            .select('soluong, chitietsanpham(gia)')
            .eq('magiohang', cart.magiohang)

        if (errorAllItems)
            throw errorAllItems

        // cap nhat lai gio hang
        const tongsoluong = allItems.reduce((acc, item) => acc + item.soluong, 0);
        const totalamount = allItems.reduce((acc, item) => acc + item.soluong * (item.chitietsanpham?.gia || 0), 0);

        const { error: errorUpdateCart } = await supabase
            .from('giohang')
            .update({ tongsoluong: tongsoluong, total_amount: totalamount })
            .eq('magiohang', cart.magiohang)

        if (errorUpdateCart)
            throw errorUpdateCart

        // api tra ve magiohang, tongsoluong, totalamount va danh sach san pham duoc them + soluong
        return {
            success: true,
            magiohang: cart.magiohang,
            tongsoluong,
            totalamount
        }
    } catch (error) {
        console.log('Error add product to cart!!', error)
        return {
            success: false,
            error: error.message
        }
    }
}


// lấy giỏ hàng theo khách hàng
const getCartByCustomer = async (customerId) => {
    const {data, error} = await supabase
    .from('giohang')
    .select('*')
    .eq('makhachhang', customerId)
    .single()

    return {
        cart: data,
        error: error
    }
}

// tạo giỏ hàng mới cho khách hanbgf (nếu chưa có)
const createCart = async (customerId) => {
    const {data, error} = await supabase
    .from('giohang')
    .insert([{makhachhang: customerId, total_amount: 0, tongsoluong: 0 }])
    .single()

    return {
        cart: data,
        error: error
    }
}

// lấy chitietgiohang theo magiohang va machitietgiohang
const getCartItemById = async (itemId) => {
    const {data, error} = await supabase
    .from('chitietgiohang')
    .select('*')
    .eq('machitietgiohang', itemId)

    return {
        cartItem: data,
        error: error
    }
}

// lấy chitietsanpham theo machitietsanpham
const getProductItemById = async (productItemId) => {
    const {data, error} = await supabase
    .from('chitietsanpham')
    .select('*')
    .eq('machitietsanpham', productItemId)
    .single()

    return {
        productItem: data,
        error: error
    }
}

// tìm chitietsanpham mới trong chitietsanpham (theo masanpham + size + color)
const getProductItemByAttributes = async (productId, size, color) => {
    const {data, error} = await supabase
    .from('chitietsanpham')
    .select('*')
    .eq('masanpham', productId)
    .eq('size', size)
    .eq('color', color)

    return {
        productItem: data,
        error
    }
}

// check trong bảng chitietgiohang có tồn tại sp có magiohang + machitietsanpham chua??
const checkCartItemByCartId_ProductItemId = async (cartId, productItemId) => {
    const {data, error} = await supabase 
    .from('chitietgiohang')
    .select('*')
    .eq('magiohang', cartId)
    .eq('machitietsanpham', productItemId)
    .single()

    return {
        cartItemExists: data,
        error
    }
}

// cập nhật số lượng trong chitietdonhang
const updateCartItemQuantity = async (itemId, newQuantity) => {
    const {error} = await supabase
    .from('chitietgiohang')
    .update({soluong: newQuantity})
    .eq('machitietgiohang', itemId)

    return {error}
}

// xóa chitietgiohang
const deleteCartItem = async (itemId) => {
    const {error} = await supabase
    .from('chitietgiohang')
    .delete()
    .eq('machitietgiohang', itemId)

    return {error}
}

// cập nhật machitietsanpham và số lượng trong chitietgiohang
const updateCartItemProductItemAndQuantity = async (itemId, newProductItemId, newQuantity) => {
    const {data, error} = await supabase
    .from('chitietgiohang')
    . update({
        machitietsanpham: newProductItemId,
        soluong: newQuantity
    })
    .eq('machitietgiohang', itemId)

    return {error}
}

// lấy toàn bộ chitietgiohang của giohang -> tính tổng
const getAllCartItems = async (cartId) => {
    const {data, error} = await supabase
    .from('chitietgiohang')
    .select('soluong, machitietsanpham(gia)')
    .eq('magiohang', cartId)

    return {
        items: data,
        error
    }
}

// update tổng số lượng và tổng tiền của giỏ hàng
const updateCartTotals = async (cartId, totalQty, totalAmt) => {
    const { error } = await supabase
    .from('giohang')
    .update({
      tongsoluong: totalQty,
      total_amount: totalAmt
    })
    .eq('magiohang', cartId);

  return { error };
}


module.exports = { getCartItem, addOrUpdateCartItem,
    getCartByCustomer, getCartItemById, createCart,
    checkCartItemByCartId_ProductItemId, getProductItemByAttributes,
    deleteCartItem, updateCartItemQuantity, getAllCartItems, updateCartItemProductItemAndQuantity,
    updateCartTotals, getProductItemById
 }