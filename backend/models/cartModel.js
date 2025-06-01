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
        console.error("Error fetching data: ", data)
        return null
    }

    console.error("Error fetching data: ", data)
    return data;
}

module.exports = { getCartItem }