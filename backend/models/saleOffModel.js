const supabase = require('../config/supabaseClient');

const getSaleOffs = async (limit, offset, filters) => {
    console.log('Fetching sale offs with filters:', filters);
    let query = supabase.from('saleoff').select('*');
    if (filters.minValue || filters.maxValue) {
        query = query.gte('giatri', filters.minValue ? filters.minValue : 0).lte('giatri', filters.maxValue ? filters.maxValue : 100);
    }

    if (filters.saleOffId) {
        query = query.eq('masaleoff', filters.saleOffId);
    }

    if (filters.status) {
        query = query.eq('trangthai', filters.status);
    }

    if (filters.startDate) {
        query = query.eq('ngaybatdau', filters.startDate);
    }

    if (filters.endDate) {
        query = query.eq('ngayketthuc', filters.endDate);
    }

    if (limit) {
        query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return data;
};

const getSaleOffCount = async (filters) => {
    let query = supabase.from('saleoff').select('masaleoff', { count: 'exact' });

    if (filters.minValue && filters.maxValue) {
        query = query.gte('giatri', filters.minValue).lte('giatri', filters.maxValue);
    }

    if (filters.saleOffId) {
        query = query.eq('masaleoff', filters.saleOffId);
    }

    if (filters.status) {
        query = query.eq('trangthai', filters.status);
    }

    if (filters.startDate) {
        query = query.gte('ngaybatdau', filters.startDate);
    }

    if (filters.endDate) {
        query = query.lte('ngayketthuc', filters.endDate);
    }

    const { count, error } = await query;

    if (error) {
        throw error;
    }

    return count;
};

const insertSaleOff = async (saleOffData) => {
    const { data, error } = await supabase
        .from('saleoff')
        .insert({
            giatri: saleOffData.value,
            trangthai: saleOffData.status,
            ngaybatdau: saleOffData.startDate,
            ngayketthuc: saleOffData.endDate
        })
        .single()
        .select();

    if (error) {
        throw error;
    }

    return data;
};

const deleteSaleOff = async (saleOffId) => {
    const { data, error } = await supabase
        .from('saleoff')
        .delete()
        .eq('masaleoff', saleOffId)
        .select();

    if (error) {
        throw error;
    }

    return data;
}

const updateSaleOff = async (saleOffId, updates) => {
    const allowedUpdates = ['value', 'status', 'startDate', 'endDate'];
    const updateData = {};

    for (const key of allowedUpdates) {
        if (key in updates) {
            updateData[key] = updates[key];
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const saleOffData = {};

    if (updateData.value !== undefined) {
        saleOffData.giatri = updateData.value;
    }

    if (updateData.status !== undefined) {
        saleOffData.trangthai = updateData.status;
    }

    if (updateData.startDate !== undefined) {
        saleOffData.ngaybatdau = updateData.startDate;
    }

    if (updateData.endDate !== undefined) {
        saleOffData.ngayketthuc = updateData.endDate;
    }

    const { data, error } = await supabase
        .from('saleoff')
        .update(saleOffData)
        .eq('masaleoff', saleOffId)
        .select();

    if (error) {
        throw error;
    }

    return data;
};

module.exports = {
    getSaleOffs,
    getSaleOffCount,
    insertSaleOff,
    deleteSaleOff,
    updateSaleOff
};