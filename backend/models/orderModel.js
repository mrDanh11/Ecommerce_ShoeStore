const supabase = require('../config/supabaseClient')

const createOrder = async (customerId, totalQuantity ,totalAmount, finalAmount, voucher, shipmentId) => {
    const {data, error} = await supabase
    .from('hoadon')
    .insert([{
        makhachhang: customerId,
        ngaydat: new Date(),
        tongsoluong: totalQuantity,
        tongtien: totalAmount,
        thanhtien: finalAmount,
        voucher: voucher,
        mashipment: shipmentId
    }])
    .select()

    if(error){
        console.log('error insert data from order: ', error)
        return null
    }
    console.log('check order: ', data[0])
    orderData = data[0]

    return orderData
}


const createOrderItem = async (orderId, productId, quantity, totalPrice) => {
    if (!orderId) {
        console.error('Order ID is missing');
        return { error: 'Order ID is missing' };
    }

    const { data, error } = await supabase
        .from('chitiethoadon')
        .insert([{
            mahoadon: orderId,  
            machitietsanpham: productId,
            tongsoluong: quantity,
            tongtien: totalPrice,
        }]);

    if (error) {
        console.error('Error inserting order item:', error.message || error.details);
        return { error };  
    }

    return { data };
};


module.exports = {
    createOrder, createOrderItem
}