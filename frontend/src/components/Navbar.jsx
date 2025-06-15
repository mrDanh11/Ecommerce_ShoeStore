import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
import { FaShoppingCart } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaUser } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import Shoea from "../assets/Shoea-Logo.svg"
import Minicart from "./Minicart"
import SearchBar from "./SearchBar"


const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [minicartOpen, setMinicartOpen] = useState(false);

  // useEffect để kiểm tra kích thước màn hình và đóng nav drawer
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setNavDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    console.log("Tìm kiếm:", searchTerm);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Đảm bảo đóng các overlay khác khi mở/đóng search bar
    if (!isSearchOpen) { 
      if (navDrawerOpen) setNavDrawerOpen(false);
      if (minicartOpen) setMinicartOpen(false);
    } else {
      setSearchTerm(""); 
    }
  };

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
    // Khi mở/đóng nav drawer, đảm bảo search overlay và minicart đóng lại
    if (!navDrawerOpen) {
      if (isSearchOpen) setIsSearchOpen(false);
      if (minicartOpen) setMinicartOpen(false);
    }
  };

  const toggleMinicart = () => {
    setMinicartOpen(!minicartOpen);
    // Khi mở/đóng minicart, đảm bảo search overlay và nav drawer đóng lại
    if (!minicartOpen) {
      if (isSearchOpen) setIsSearchOpen(false);
      if (navDrawerOpen) setNavDrawerOpen(false);
    }
  };


  const handleTurnOffMinicart = () => {
    setMinicartOpen(false);
  }

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 h-18 relative z-40">
        {/* Left - Logo */}
        <div>
          <Link to="/" className="flex items-center text-2xl font-bold text-black p-1" aria-label="Home">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <img className="w-8 h-8" src={Shoea} alt="Shoea" />
            </div>
            Shoea
          </Link>
        </div>

        {/* Center - Navigation links - Desktop only */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-black font-medium">Trang chủ</Link>
          <Link to="/about" className="text-gray-700 hover:text-black font-medium">Giới thiệu</Link>
          <Link to="/collections" className="text-gray-700 hover:text-black font-medium">Sản phẩm</Link>
          <Link to="/contact" className="text-gray-700 hover:text-black font-medium">Liên hệ</Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className="cursor-pointer hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Tìm kiếm"
          >
            <HiMagnifyingGlass className="h-6 w-6 text-gray-800" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={toggleMinicart}
            className="cursor-pointer hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Shopping cart"
          >
            <FaShoppingCart className="h-6 w-6 text-gray-700" />
          </button>

          {/* Profile Icon for Login/Register */}
          <Link to="/login" className="hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Login">
            <FaUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* Hamburger Menu Icon: Visible only on small screens */}
          <button
            onClick={toggleNavDrawer}
            className="md:hidden cursor-pointer p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            <GiHamburgerMenu className="h-6 w-6 text-gray-800" />
          </button>

        </div>

        {/* SearchBar */}
        <SearchBar
          isOpen={isSearchOpen}
          onClose={toggleSearch}
          onSubmit={handleSearchSubmit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />


        {/* Mobile Navigation */}
        <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex justify-end p-4">
            <button onClick={toggleNavDrawer} className="cursor-pointer">
              <IoMdClose className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="p-10">
            <h2 className="text-2xl font-semibold mb-4">Menu</h2>
            <nav className="space-y-4">
              <Link to="/" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium">Trang chủ</Link>
              <Link to="/about" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium">Giới thiệu</Link>
              <Link to="/collections" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium">Sản phẩm</Link>
              <Link to="/contact" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium ">Liên hệ</Link>
            </nav>
          </div>
        </div>
      </nav>
      {/* Minicart */}
      <Minicart handleTurnOffMinicart={handleTurnOffMinicart} minicartOpen={minicartOpen} toggleMinicart={toggleMinicart} />
    </>
  )
}

export default Navbar
