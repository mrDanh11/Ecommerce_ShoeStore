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
    console.log('updatePaymentStatus called with:', { orderId, status });
  
    const { data: before, error: selErr } = await supabase
      .from('payment')
      .select('*')
      .eq('mahoadon', orderId);
    // console.log('→ select before update:', { before, selErr });
  
    const updates = { status, updated_at: new Date() };
    if (status === 'completed') {
      updates.paid_at = new Date();
    }
  
    const { data, error } = await supabase
      .from('payment')
      .update([updates])
      .eq('mahoadon', orderId)
      .single();
  
    console.log('→ update result:', { data, error });
  
    return { data, error };
  };
  


module.exports = {
    createPayment, updatePaymentStatus
}