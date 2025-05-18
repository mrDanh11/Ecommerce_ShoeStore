import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm, có thể gọi API hoặc điều hướng
    console.log("Searching for:", searchTerm);
  };
  
  return (
    <nav className="bg-white shadow-md px-16 py-8 flex justify-between items-center">
      {/* Left - Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        ShoeStore
      </Link>

      {/* Center - Menu Links */}
      <div className="space-x-6">
        <Link to="#" className="text-black text-2xl font-bold hover:text-gray-600 uppercase">Sản phẩm</Link>
        <Link to="#" className="text-black text-2xl font-bold hover:text-gray-600 uppercase">Nam</Link>
        <Link to="#" className="text-black text-2xl font-bold hover:text-gray-600 uppercase">Nữ</Link>
        <Link to="#" className="text-black text-2xl font-bold hover:text-gray-600 uppercase">Sale Off</Link>
      </div>

      {/* Right - Search*/} 
      <div className="flex items-center space-x-4 relative">
        <form onSubmit={handleSearch} className="relative">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
          <input type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm"
          className="bg-gray-100 mr-2.5 pl-10 pr-3 py-2 rounded-2xl border-none focus:outline-none text-black" />
        </form>
      </div>

    </nav>
  );
};

export default Navbar;