const userModel = require('../models/userModel');

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
