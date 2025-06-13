const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Xác thực không hợp lệ' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kiểm tra user có tồn tại trong DB
      const user = await userModel.getUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'Người dùng không tồn tại' 
        });
      }
      
      // Thêm thông tin user vào request
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        email: user.email
      };
      
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        success: false,
        error: 'Token không hợp lệ' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Lỗi xác thực' 
    });
  }
};