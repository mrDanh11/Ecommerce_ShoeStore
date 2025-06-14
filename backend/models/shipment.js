const supabase = require('../config/supabaseClient')

const createShipment = async (customerId, address) => {
    const shipmentDate = new Date();
    shipmentDate.setDate(shipmentDate.getDate() + 7);  

    const { data, error } = await supabase
        .from('shipment')
        .insert([{
            makhachhang: customerId,
            diachigiaohang: address,
            ngaygiaohang: shipmentDate.toISOString().split('T')[0],
            trangthai: 'Chưa/Đang Giao',
            mavanchuyen: 'GIAOHANG111',
        }])
        .select();  

    if (error) {
        console.error('Error inserting shipment:', error.message || error.details);
        return { error };  
    }

    const shipment = data[0];  
    console.log('Shipment created successfully:', shipment);
    return shipment;  
};

module.exports = { createShipment };
