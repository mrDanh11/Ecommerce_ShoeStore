const userModel = require('../models/userModel');
const supabase = require('../config/supabaseClient');

// Lấy danh sách người dùng (có phân trang & tìm kiếm)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data: users, count } = await userModel.listUsers({
      limit: parseInt(limit),
      offset,
      search,
      role
    });

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cập nhật thông tin người dùng (trừ mật khẩu)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (updates.password || updates.matkhau) {
      return res.status(400).json({
        success: false,
        error: 'Không thể cập nhật mật khẩu ở endpoint này'
      });
    }

    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Người dùng không tồn tại'
      });
    }

    const updatedUser = await userModel.updateUser(userId, updates);

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (parseInt(userId) === parseInt(req.user.userId)) {
      return res.status(400).json({
        success: false,
        error: 'Bạn không thể xóa tài khoản của chính mình'
      });
    }

    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Người dùng không tồn tại'
      });
    }

    await userModel.deleteUser(userId);

    res.json({
      success: true,
      message: 'Người dùng đã được xóa'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Lấy hóa đơn và ghép tên khuyến mãi thủ công
exports.getInvoices = async (req, res) => {
  try {
    const { from, to } = req.query;

    // 1. Truy vấn tất cả hóa đơn trong khoảng thời gian
    let invoiceQuery = supabase
      .from('hoadon')
      .select('*')
      .order('ngaydat', { ascending: false });

    if (from) invoiceQuery = invoiceQuery.gte('ngaydat', from);
    if (to) invoiceQuery = invoiceQuery.lte('ngaydat', to);

    const { data: invoices, error: invoiceError } = await invoiceQuery;
    if (invoiceError) throw invoiceError;

    // 2. Truy vấn tất cả khuyến mãi để đối chiếu
    const { data: promotions, error: promoError } = await supabase
      .from('khuyenmai')
      .select('makhuyenmai, tenkhuyenmai');

    if (promoError) throw promoError;

    // 3. Ghép tên khuyến mãi vào mỗi hóa đơn (nếu có)
    const result = invoices.map((hd) => {
      const promo = promotions.find(p => p.makhuyenmai === hd.voucher);
      return {
        ...hd,
        khuyenmai: promo ? { tenkhuyenmai: promo.tenkhuyenmai } : null
      };
    });

    // 4. Tính tổng doanh thu
    const totalRevenue = result.reduce((sum, hd) => sum + (hd.thanhtien || 0), 0);

    res.json({
      success: true,
      invoices: result,
      totalRevenue,
    });
  } catch (err) {
    console.error("Lỗi khi lấy hóa đơn:", err.message);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
};
