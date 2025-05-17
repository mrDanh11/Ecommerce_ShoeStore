import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        ShoeStore
      </Link>

      {/* Menu Links */}
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Trang chủ</Link>
        <Link to="/products" className="text-gray-700 hover:text-blue-600">Sản phẩm</Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">Giới thiệu</Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-600">Liên hệ</Link>
      </div>

      {/* Icons */}
      <div className="space-x-4">
        <button title="Giỏ hàng">🛒</button>
        <button title="Tài khoản">👤</button>
      </div>
    </nav>
  );
};

export default Navbar;
