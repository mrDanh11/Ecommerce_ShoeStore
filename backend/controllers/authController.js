const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Đăng ký tài khoản
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;
    
    // Kiểm tra email đã tồn tại
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }
    
    // Tạo người dùng mới
    const newUser = await userModel.createUser({
      email,
      password,
      name,
      phone,
      address
    });
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      success: true,
      user: newUser,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = await userModel.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Trả về thông tin user (không bao gồm password_hash)
    const { password_hash, ...userData } = user;
    
    res.json({
      success: true,
      user: userData,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Đăng nhập bằng Google
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user; // Đã được xác thực bởi Passport
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Trả về thông tin user (không bao gồm password_hash)
    const { password_hash, ...userData } = user;
    
    res.json({
      success: true,
      user: userData,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    
    // Lấy thông tin user
    const user = await userModel.getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Người dùng không tồn tại' 
      });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await userModel.comparePassword(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Mật khẩu hiện tại không đúng' 
      });
    }
    
    // Cập nhật mật khẩu mới
    await userModel.updatePassword(userId, newPassword);
    
    res.json({
      success: true,
      message: 'Mật khẩu đã được cập nhật'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Người dùng không tồn tại' 
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Đăng xuất
exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};
