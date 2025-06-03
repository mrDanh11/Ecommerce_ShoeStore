const supabase = require('../config/supabaseClient');

// test
const getAllProduct = async () =>{
    const {data, error} = await supabase.from('sanpham').select('*')
    if(error) throw error

    return data;
}

module.exports = {getAllProduct}