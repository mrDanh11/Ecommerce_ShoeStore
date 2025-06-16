import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { HiMagnifyingGlass } from "react-icons/hi2"
import { FaShoppingCart } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaUser } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import Shoea from "../assets/Shoea-Logo.svg"
import Minicart from "./Minicart"
import SearchBar from "./SearchBar"
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [minicartOpen, setMinicartOpen] = useState(false);

  // ------------------------------------------------------------------------
  
  // Profile Login/Logout
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // 1. Kiểm tra trạng thái từ backend custom (qua localStorage token)
      const customBackendToken = localStorage.getItem("token");
      if (customBackendToken) {
        setIsLoggedIn(true);
        return; // Nếu đã đăng nhập qua backend custom, không cần kiểm tra Supabase
      }

      // 2. Nếu chưa có token từ backend custom, kiểm tra Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      } else if (error) {
        console.error("Error getting Supabase session:", error);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Lắng nghe sự kiện thay đổi trạng thái Auth của Supabase
    // Điều này đảm bảo Navbar cập nhật ngay lập tức nếu người dùng đăng nhập/đăng xuất qua Google
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
        }
      }
    );

    // Clean up listener khi component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Chạy một lần khi component được mount

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // Đảm bảo đóng các overlay khác khi mở/đóng dropdown profile
    if (!isProfileDropdownOpen) {
      if (navDrawerOpen) setNavDrawerOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
      if (minicartOpen) setMinicartOpen(false);
    }
  };

  const handleLogout = async () => {
    // Xóa token từ backend custom (nếu có)
    localStorage.removeItem("token");

    // Xóa session từ Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out from Supabase:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    } else {
      console.log("Đã đăng xuất thành công khỏi Supabase.");
    }

    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    setIsProfileDropdownOpen(false); // Đóng dropdown
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };


  // ------------------------------------------------------------------------
  
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

          {/* Profile Icon and Dropdown */}
          {/* Sử dụng một div thay vì Link trực tiếp để chứa icon và dropdown */}
          <div className="relative"> {/* Thêm class "relative" để dropdown định vị tuyệt đối */}
            <button
              onClick={toggleProfileDropdown}
              className="cursor-pointer hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center" // Thêm flex và items-center để căn chỉnh tốt hơn
              aria-label="Profile"
            >
              <FaUser className="h-6 w-6 text-gray-700" />
            </button>

            {/* Dropdown Content */}
            {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)} // Đóng dropdown khi click link
                      >
                        Xem thông tin cá nhân
                      </Link>
                      <Link
                        to="/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)} // Đóng dropdown khi click link
                      >
                        Xem lịch sử đơn hàng
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)} // Đóng dropdown khi click link
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)} // Đóng dropdown khi click link
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
            )}
          </div>

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
