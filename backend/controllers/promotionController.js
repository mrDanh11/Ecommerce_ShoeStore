const supabase = require('../config/supabaseClient');

// Lấy danh sách khuyến mãi
exports.getPromotions = async (req, res) => {
  try {
    const { search = '' } = req.query;

    let query = supabase.from('khuyenmai').select('*');

    if (search) {
      query = query.ilike('tenkhuyenmai', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi lấy danh sách khuyến mãi:', err.message);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
};

// Tạo khuyến mãi mới
exports.createPromotion = async (req, res) => {
  try {
    const { tenkhuyenmai, giatri, trangthai, ngaybatdau, ngayketthuc } = req.body;
    if (!tenkhuyenmai || giatri == null || ngaybatdau == null|| ngayketthuc == null ) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin' });
    }

    const { data, error } = await supabase.from('khuyenmai').insert([{ tenkhuyenmai, giatri, trangthai, ngaybatdau, ngayketthuc }]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Cập nhật khuyến mãi
exports.updatePromotion = async (req, res) => {
  try {
    const id = req.params.id;
    const { tenkhuyenmai, giatri, trangthai, ngaybatdau, ngayketthuc } = req.body;

    const { data, error } = await supabase.from('khuyenmai')
      .update({ tenkhuyenmai, giatri, trangthai, ngaybatdau, ngayketthuc })
      .eq('makhuyenmai', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Xóa khuyến mãi
exports.deletePromotion = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from('khuyenmai').delete().eq('makhuyenmai', id);
    if (error) throw error;
    res.json({ success: true, message: 'Đã xóa khuyến mãi' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

