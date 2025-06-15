const supabase = require('../config/supabaseClient')

const getCustomerById = async (customerId) => {
    const {data, error} = await supabase
    .from('khachhang')
    .select('*')
    .eq('makhachhang', customerId)
    .single()

   if(error){
    console.log('error fetching data from customer: ', error)
    return null
   }

   return {data}
}

module.exports = {
    getCustomerById
}