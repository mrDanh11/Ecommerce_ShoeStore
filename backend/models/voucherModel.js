const supabase = require('../config/supabaseClient')

const getVoucherById = async (voucherId) => {
    const { data, error } = await supabase
        .from('khuyenmai')
        .select('*')
        .eq('makhuyenmai', voucherId)
        .single();

    if(error){
        console.log('error fetching data from khuyenmai: ', error)
        return null
    }

    return {data}
}

module.exports = {
    getVoucherById
}