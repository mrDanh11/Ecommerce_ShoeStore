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

const updatePaymentStatus = async (orderId, status) => {
    console.log('check orderId from model: ', orderId)
    console.log('check statusdy from model: ', status)

    const {data, error} = await supabase 
    .from('payment')
    .update({status: status, updated_at: new Date()})
    .eq('mahoadon', orderId)

    return {data,  error}
}


module.exports = {
    createPayment, updatePaymentStatus
}