const supabase = require('../config/supabaseClient')

const createPayment = async (orderId, paymentmethod, thanhtien) => {
    const { data, error } = await supabase
        .from('payment')
        .insert([{
            mahoadon: orderId,
            phuongthuc: paymentmethod,
            status: 'pending',
            amount: thanhtien,
        }])
        .select()

    if(error)
        return error

    console.log('check payment: ', data)
    payment = data[0]
    return payment
}

module.exports = {
    createPayment
}