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

module.exports = {
    createOrderItem
}