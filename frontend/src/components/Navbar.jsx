import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoHeart } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching:", searchTerm);
  };

  // Dùng để ẩn thanh search khi resize từ trạng thái mobile về tablet và desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setShowSearch(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <nav className="bg-white shadow-md px-4 md:px-12 lg:px-16 py-4 flex flex-col">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-black">
          Shoe Store
        </Link>

        {/* Menu links - desktop */}
        <div className="hidden lg:flex space-x-6">
          <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Sản phẩm</Link>
          <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Nam</Link>
          <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Nữ</Link>
          <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Sale Off</Link>
        </div>

        {/* Right icons */}
        <div className="flex space-x-4 items-center">
          {/* Search form - desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden sm:block"
          >
            <button
              type="submit"
              className="absolute left-0 top-0 h-full px-3 flex items-center justify-center text-gray-600 text-xl focus:outline-none"
              tabIndex={-1}
              aria-label="Tìm kiếm"
            >
              <IoSearch className="cursor-pointer" />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm"
              className="bg-gray-100 pl-10 pr-3 py-2 rounded-2xl border-none focus:outline-none text-black"
            />
          </form>

          {/* Search icon - mobile */}
          <IoSearch
            onClick={() => setShowSearch(!showSearch)}
            className="text-xl cursor-pointer text-gray-800 block sm:hidden"
          />

          {/* Favorite - only mobile */}
          <IoHeart className="text-xl cursor-pointer text-gray-800 lg:hidden" />

          {/* Cart - only mobile */}
          <FaCartPlus className="text-xl cursor-pointer text-gray-800 lg:hidden" />

          {/* Hamburger - only mobile */}
          <GiHamburgerMenu
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-800 lg:hidden"
          />
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <form
          onSubmit={handleSearchSubmit}
          className="mt-4 flex items-center border border-gray-300 rounded overflow-hidden"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="flex-1 px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer text-white px-4 py-2 h-fit"
          >
            <FaArrowRight className="text-black"/>
          </button>
        </form>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mt-4 flex flex-col space-y-2 lg:hidden">
          <Link to="#" className="text-black font-semibold">Sản phẩm</Link>
          <Link to="#" className="text-black font-semibold">Nam</Link>
          <Link to="#" className="text-black font-semibold">Nữ</Link>
          <Link to="#" className="text-black font-semibold">Sale Off</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
