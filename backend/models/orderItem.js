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

// chưa có filter -> chỉ có lấy order của 1 customer qua id
const getListOrderItemByCustomerId = async (customerId) => {
    const { data, error } = await supabase
        .from('chitiethoadon')
        .select(`
            mahoadon, 
            hoadon(mahoadon, makhachhang, mashipment, ngaydat, tongsoluong, tongtien, thanhtien, voucher,
            payment(id, mahoadon, phuongthuc, status, paid_at, amount, created_at, updated_at),
            shipment(mashipment, makhachhang, diachigiaohang, trangthai, mavanchuyen, name, sdt)),

            machitietsanpham, tongsoluong, tongtien,
            chitietsanpham(machitietsanpham, size, color, soluong, gia, masanpham,
                sanpham(masanpham, tensanpham, gia, description, tinhtrang, anhsanpham)
            )
        `)

        .eq('hoadon.makhachhang', customerId)

    if (error) {
        console.log('check erorL:', error)
        return null
    }

    return { data, error }
}

// đã có filter -> tìm theo customerId hoặc getAll 
const getAllOrder = async (limit = 10, offset = 0, filters = {}) => {
    console.log('check filters:', filters);
    console.log('limit:', limit, 'offset:', offset);

    let hoaDonIds = null;

    // lọc hoadon theo fromDate / toDate trước
    if (filters?.fromDate || filters?.toDate) {
        let hoaDonQuery = supabase.from('hoadon').select('mahoadon');

        if (filters.fromDate) {
            console.log('Lọc hoadon từ ngày:', filters.fromDate);
            hoaDonQuery = hoaDonQuery.gte('ngaydat', filters.fromDate);
        }
        if (filters.toDate) {
            console.log('Lọc hoadon đến ngày:', filters.toDate);
            hoaDonQuery = hoaDonQuery.lte('ngaydat', filters.toDate);
        }

        const { data: hoaDonDateData, error: hoaDonDateErr } = await hoaDonQuery;
        if (hoaDonDateErr) {
            console.log('Lỗi lấy hoadon theo ngày:', hoaDonDateErr);
            return { data: null, error: hoaDonDateErr };
        }

        if (!hoaDonDateData || hoaDonDateData.length === 0) {
            console.log('Không có hoadon nào match ngày');
            return { data: [], error: null };
        }

        hoaDonIds = hoaDonDateData.map(h => h.mahoadon);
    }

    // lọc shipment 
    if (filters?.trangthai) {
        console.log('Lọc shipment theo trạng thái:', filters.trangthai);
        const { data: shipmentData, error: shipErr } = await supabase
            .from('shipment')
            .select('mashipment')
            .eq('trangthai', filters.trangthai);

        if (shipErr) {
            console.log('Lỗi lấy shipment:', shipErr);
            return { data: null, error: shipErr };
        }

        if (!shipmentData || shipmentData.length === 0) {
            console.log('Không có shipment nào match');
            return { data: [], error: null };
        }

        const shipmentIds = shipmentData.map(s => s.mashipment);

        // lấy hoadon theo shipment
        const { data: hoaDonShipData, error: hoaDonShipErr } = await supabase
            .from('hoadon')
            .select('mahoadon')
            .in('mashipment', shipmentIds);

        if (hoaDonShipErr) {
            console.log('Lỗi lấy hoadon theo shipment:', hoaDonShipErr);
            return { data: null, error: hoaDonShipErr };
        }

        if (!hoaDonShipData || hoaDonShipData.length === 0) {
            console.log('Không có hoadon nào match shipment');
            return { data: [], error: null };
        }

        const hoaDonShipIds = hoaDonShipData.map(h => h.mahoadon);

        // giao tập ID nếu từ ngày + shipment cùng filter
        if (hoaDonIds) {
            hoaDonIds = hoaDonIds.filter(id => hoaDonShipIds.includes(id));
            if (hoaDonIds.length === 0) {
                console.log('⚠ Không có hoadon nào match cả ngày và shipment');
                return { data: [], error: null };
            }
        } else {
            hoaDonIds = hoaDonShipIds;
        }
    }

    // query 
    let query = supabase
        .from('chitiethoadon')
        .select(`
            mahoadon, 
            hoadon(
                mahoadon, makhachhang, mashipment, ngaydat, tongsoluong, tongtien, thanhtien, voucher,
                payment(
                    id, mahoadon, phuongthuc, status, paid_at, amount, created_at, updated_at
                ),
                shipment(
                    mashipment, makhachhang, diachigiaohang, trangthai, mavanchuyen, name, sdt
                )
            ),
            machitietsanpham, tongsoluong, tongtien,
            chitietsanpham(
                machitietsanpham, size, color, soluong, gia, masanpham,
                sanpham(
                    masanpham, tensanpham, gia, description, tinhtrang, anhsanpham
                )
            )
        `)
        .range(offset, offset + limit - 1);

    if (filters?.makhachhang) {
        query = query.eq('hoadon.makhachhang', filters.makhachhang);
    }
    if (hoaDonIds) {
        query = query.in('mahoadon', hoaDonIds);
    }

    const { data, error } = await query;
    if (error) {
        console.log('Lỗi query chính:', error);
        return { data: null, error };
    }

    console.log('check data:', data);
    return { data, error: null };
};


module.exports = {
    createOrderItem, getListOrderItemByCustomerId, getAllOrder
}