const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
  console.log("Cookie nhận được từ client:", req.cookies);
  console.log('Headers:', req.headers.cookie);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Bạn chưa đăng nhập. Token không tồn tại.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = {
      userId: decoded.mataikhoan || decoded._id,
      email: decoded.email,
      vaitro: decoded.vaitro
    };
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};


module.exports = {verifyToken};




