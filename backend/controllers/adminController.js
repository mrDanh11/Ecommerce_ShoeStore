const userModel = require('../models/userModel');

// Lấy danh sách người dùng (phân trang, tìm kiếm)
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;
    
    const { data: users, count } = await userModel.listUsers({
      limit: parseInt(limit),
      offset: parseInt(offset),
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

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Không cho phép cập nhật mật khẩu qua endpoint này
    if (updates.password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng sử dụng endpoint đổi mật khẩu'
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
    
    // Không cho phép xóa chính mình
    if (parseInt(userId) === parseInt(req.user.userId)) {
      return res.status(400).json({
        success: false,
        error: 'Bạn không thể xóa tài khoản của chính mình'
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