import { useState } from "react"
import { Link } from "react-router-dom"
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
import { FaShoppingCart } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaUser } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import Shoea from "../assets/Shoea-Logo.svg"
import Minicart from "./Minicart"


const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [minicartOpen, setMinicartOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchTerm);
    // If the mobile search overlay is open, close it after submission
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    // If opening the search bar, close the mobile menu to prevent overlap
    if (!isSearchOpen && navDrawerOpen) {
      setNavDrawerOpen(false);
    }
  };

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
    // If opening the menu, close the search bar to prevent overlap
    if (!navDrawerOpen && isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleMinicart = () => {
    setMinicartOpen(!minicartOpen);
  };

  const handleTurnOffMinicart = () => {
    setMinicartOpen(false);
  }

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 h-18">
        {/* Left - Logo */}
        <div>
          <Link to="/" className="flex items-center text-2xl font-bold text-black p-1" aria-label="Home">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2"> {/* Thêm div này */}
              <img className="w-8 h-8" src={Shoea} alt="Shoea" /> {/* Điều chỉnh kích thước ảnh nếu cần */}
            </div>
            Shoea {/* Thêm text Shoea */}
          </Link>
        </div>

        {/* Center - Navigation links - desktop only */}
        <div className="hidden md:flex space-x-6">
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase">Sản phẩm</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase">Nam</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase">Nữ</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase">Sale Off</Link>
        </div>

        {/* Right icons and search */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search Form: Visible on medium screens and up */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex items-center bg-gray-100 rounded-3xl overflow-hidden h-10 w-50"
          >
            <button
              type="submit"
              className="absolute left-4 text-gray-400 cursor-pointer"
              tabIndex={-1}
              aria-label="Tìm kiếm"
            >
              <HiMagnifyingGlass className="w-5 h-5 text-black" />
            </button>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-3xl"
              aria-label="Tìm kiếm"
            />
          </form>

          {/* Mobile Search Icon: Visible only on small screens */}
          <button
            onClick={handleSearchToggle}
            className="md:hidden cursor-pointer hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle search bar"
          >
            <HiMagnifyingGlass className="h-6 w-6 text-gray-800" />
          </button>

          {/* Cart Icon */}
          <button
            onClick={toggleMinicart}
            className="cursor-pointer hover:text-black p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Shopping cart"
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

        {/* Mobile Search Overlay*/}
        {isSearchOpen && (
          <div className="flex items-center justify-center w-full transition-all duration-300 absolute top-0 left-0 bg-white h-18 z-50">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center justify-center w-full"
            >
              <div className="relative w-3/5">
                <input 
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
                />
                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  <HiMagnifyingGlass className="h-6 w-6" />
                </button>
              </div>
              {/* Close Button */}
              <button
                type="button"
                onClick={handleSearchToggle}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <HiMiniXMark className="h-6 w-6" />
              </button>
            </form>
          </div>
        )}

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
              <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium uppercase">Sản phẩm</Link>
              <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium uppercase">Nam</Link>
              <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium uppercase">Nữ</Link>
              <Link to="#" onClick={toggleNavDrawer} className="block text-gray-700 hover:text-black font-medium uppercase">Sale Off</Link>
            </nav>
          </div>
        </div>
      </nav>
      <Minicart handleTurnOffMinicart={handleTurnOffMinicart} minicartOpen={minicartOpen} toggleMinicart={toggleMinicart} />
    </>
  )
}

export default Navbar
