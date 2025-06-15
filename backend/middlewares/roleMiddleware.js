module.exports = (requiredRole) => {
  return (req, res, next) => {
    console.log(' user từ token:', req.user);
    const userRole = req.user.vaitro || req.user.marole;

    if (!userRole) {
      return res.status(401).json({ 
        success: false,
        error: 'Không xác định được quyền người dùng' 
      });
    }

    const roleMap = {
      admin: 1,
      user: 2,
      staff: 3,
    };

    if (roleMap[requiredRole] !== userRole) {
      return res.status(403).json({ 
        success: false,
        error: 'Không có quyền truy cập' 
      });
    }

    next();
  };
};
