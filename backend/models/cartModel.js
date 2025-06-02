const supabase = require('../config/supabaseClient')

const getCartItem = async (customerId) => {
    const { data, error } = await supabase.from('khachhang')
        .select(`
                makhachhang, hoten,
                giohang(magiohang, chitietgiohang(sanpham(masanpham ,tensanpham, gia, anhsanpham, size, color)
                                , soluong
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

const addOrUpdateCartItem = async (customerId, masanpham, soluongMoiThem) => {
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

        // ktra sp da co trong chitietgiohang chua
        const { data: existingItem, error: errorItem } = await supabase
            .from('chitietgiohang')
            .select('*')
            .eq('magiohang', cart.magiohang)
            .eq('masanpham', masanpham)
            .single()

        if (errorItem && errorItem.code !== 'PGRST116')
            throw errorItem
        // neu co -> tang so luong
        if (existingItem) {
            const newQuantity = existingItem.soluong + soluongMoiThem
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
                .insert([{ magiohang: cart.magiohang, soluong: soluongMoiThem, masanpham: masanpham }])

            if (errorInsert)
                throw errorInsert
        }

        // lay lai toan bo san pham trong gio hang --> de tinh tong tien va tong so luong
        const { data: allItems, error: errorAllItems } = await supabase
            .from('chitietgiohang')
            .select('soluong, masanpham(gia)')
            .eq('magiohang', cart.magiohang)

        if (errorAllItems)
            throw errorAllItems

        // cap nhat lai gio hang
        const tongsoluong = allItems.reduce((acc, item) => acc + item.soluong, 0);
        const totalamount = allItems.reduce((acc, item) => acc + item.soluong * (item.masanpham?.gia || 0), 0);

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


module.exports = { getCartItem, addOrUpdateCartItem }