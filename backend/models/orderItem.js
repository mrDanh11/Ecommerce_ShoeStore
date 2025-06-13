const supabase = require('../config/supabaseClient')

const createOrderItem = async (orderId, productItemId, totalQuantity, totalAmount) => {
    const { data, error } = await supabase
        .from('chitiethoadon')
        .insert([{
            mahoadon: orderId,
            machitietsanpham: productItemId,
            tongsoluong: totalQuantity,
            tongtien: totalAmount
        }])
        .single()

    if (error) {
        console.log('error insert data from orderItem: ', error)
        return null
    }

    return data
}

const getListOrderItemByCustomerId = async (customerId) => {
    const { data, error } = await supabase
        .from('chitiethoadon')
        .select(`
            mahoadon, 
            hoadon(mahoadon, makhachhang, mashipment, ngaydat, tongsoluong, tongtien, thanhtien, voucher,
            shipment(mashipment, makhachhang, diachigiaohang, trangthai, mavanchuyen)),

            machitietsanpham, tongsoluong, tongtien,
            chitietsanpham(machitietsanpham, size, color, soluong, gia, masanpham,
                sanpham(masanpham, tensanpham, gia, description, tinhtrang, anhsanpham)
            )
        `)

        .eq('hoadon.makhachhang', customerId)

    if (error) {
        console.log('check erorL:', error)
        return null
    }

    return {data, error}
}

module.exports = {
    createOrderItem, getListOrderItemByCustomerId
}