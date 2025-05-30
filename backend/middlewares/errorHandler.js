module.exports = (err, req, res, next) => {
  console.error('[Error]', err.stack);
  
  // Xác định status code mặc định
  const statusCode = err.statusCode || 500;
  
  // Xác định thông báo lỗi
  let message = 'Internal Server Error';
  if (err.message && statusCode < 500) {
    message = err.message;
  }
  
  // Xây dựng response
  const errorResponse = {
    success: false,
    error: message
  };
  
  // Thêm chi tiết lỗi trong môi trường development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};