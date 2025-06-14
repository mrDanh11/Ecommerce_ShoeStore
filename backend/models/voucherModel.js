const supabase = require('../config/supabaseClient')

// model của bảng khachhang_khuyenmai và khuyenmai
const getVoucherById = async (voucherId) => {
    const { data, error } = await supabase
        .from('khuyenmai')
        .select('*')
        .eq('makhuyenmai', voucherId)
        .single();

    if (error) {
        console.log('error fetching data from khuyenmai: ', error)
        return null
    }

    return { data }
}

// ------- khachhang_khuyenmai (checked )
const getVoucherByIdCustomer = async (customerId, voucherId) => {
    const { data, error } = await supabase
        .from('khachhang_khuyenmai')
        .select('*')
        .eq('makhachhang', customerId)
        .eq('makhuyenmai', voucherId)
        .single();

    if (error) {
        console.log('error fetching data from khuyenmai: ', error)
        return null
    }

    console.log('check voucher of customer: ', data)
    const voucherCustomer = data
    return voucherCustomer
}

const deleteCustomerVoucherByIdVoucher = async (voucherId, customerId) => {
    const { error } = await supabase
        .from('khachhang_khuyenmai')
        .delete()
        .eq('makhuyenmai', voucherId)
        .eq('makhachhang', customerId)

    if (error) {
        console.log('error delete customer voucher!')
        return error
    }
}

// update số lượng
const updateQuantity_CustomerVoucherById = async (customerId, voucherId) => {
    const voucherCustomer = await getVoucherByIdCustomer(customerId, voucherId)
    if (voucherCustomer.soluong === 1) {
        await deleteCustomerVoucherByIdVoucher(voucherId, customerId)
        console.log('update quantity: soluong = 1 --> xóa luôn')

        return null;
    }
    else {
        const { error } = await supabase
            .from('khachhang_khuyenmai')
            .update([
                {soluong: voucherCustomer.soluong - 1}
            ])
            .eq('makhuyenmai', voucherId)
            .eq('makhachhang', customerId)

        if (error) {
            console.log('error update quantity CustomerVoucher!')
            return error
        }

        return true
    }
}


module.exports = {
    getVoucherById, getVoucherByIdCustomer, deleteCustomerVoucherByIdVoucher,
    updateQuantity_CustomerVoucherById,
}