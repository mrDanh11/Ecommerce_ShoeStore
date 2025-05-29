import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoSearch, IoHeart } from "react-icons/io5";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"
import { FaCartPlus } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import SearchBar from "./SearchBar";

// const Navbar = () => {
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     console.log("Searching:", searchTerm);
//   };

//   // Dùng để ẩn thanh search khi resize từ trạng thái mobile về tablet và desktop
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 640) {
//         setShowSearch(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
  

//   return (
//     <nav className="bg-white shadow-md px-4 md:px-12 lg:px-16 py-4 flex flex-col">
//       <div className="flex justify-between items-center">
//         {/* Logo */}
//         <Link to="/" className="text-2xl font-bold text-black">
//           Shoe Store
//         </Link>

//         {/* Menu links - desktop */}
//         <div className="hidden lg:flex space-x-6">
//           <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Sản phẩm</Link>
//           <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Nam</Link>
//           <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Nữ</Link>
//           <Link to="#" className="text-black font-semibold hover:text-gray-600 uppercase">Sale Off</Link>
//         </div>

//         {/* Right icons */}
//         <div className="flex space-x-4 items-center">
//           {/* Search form - desktop */}
//           <form
//             onSubmit={handleSearchSubmit}
//             className="relative hidden sm:block"
//           >
//             <button
//               type="submit"
//               className="absolute left-0 top-0 h-full px-3 flex items-center justify-center text-gray-600 text-xl focus:outline-none"
//               tabIndex={-1}
//               aria-label="Tìm kiếm"
//             >
//               <IoSearch className="cursor-pointer" />
//             </button>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Tìm kiếm"
//               className="bg-gray-100 pl-10 pr-3 py-2 rounded-2xl border-none focus:outline-none text-black"
//             />
//           </form>

//           {/* Search icon - mobile */}
//           <IoSearch
//             onClick={() => setShowSearch(!showSearch)}
//             className="text-xl cursor-pointer text-gray-800 block sm:hidden"
//           />

//           {/* Favorite - only mobile */}
//           <IoHeart className="text-xl cursor-pointer text-gray-800 lg:hidden" />

//           {/* Cart - only mobile */}
//           <FaCartPlus className="text-xl cursor-pointer text-gray-800 lg:hidden" />

//           {/* Hamburger - only mobile */}
//           <GiHamburgerMenu
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-2xl text-gray-800 lg:hidden"
//           />
//         </div>
//       </div>

//       {/* Search bar */}
//       {showSearch && (
//         <form
//           onSubmit={handleSearchSubmit}
//           className="mt-4 flex items-center border border-gray-300 rounded overflow-hidden"
//         >
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Tìm kiếm"
//             className="flex-1 px-4 py-2 focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="cursor-pointer text-white px-4 py-2 h-fit"
//           >
//             <FaArrowRight className="text-black"/>
//           </button>
//         </form>
//       )}

//       {/* Mobile menu */}
//       {menuOpen && (
//         <div className="mt-4 flex flex-col space-y-2 lg:hidden">
//           <Link to="#" className="text-black font-semibold">Sản phẩm</Link>
//           <Link to="#" className="text-black font-semibold">Nam</Link>
//           <Link to="#" className="text-black font-semibold">Nữ</Link>
//           <Link to="#" className="text-black font-semibold">Sale Off</Link>
//         </div>
//       )}
//     </nav>
//   );
// };

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control mobile search overlay visibility

  // Handles the search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchTerm);
    // If the mobile search overlay is open, close it after submission
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  // Toggles the visibility of the mobile search overlay
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    // If opening the search bar, close the mobile menu to prevent overlap
    if (!isSearchOpen && menuOpen) {
      setMenuOpen(false);
    }
  };

  // Toggles the visibility of the mobile navigation menu
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    // If opening the menu, close the search bar to prevent overlap
    if (!menuOpen && isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="container mx-auto flex items-center justify-between py-4 px-6">
      {/* Left - Logo */}
      <div>
        <Link to="/" className="text-2xl font-bold text-black" aria-label="Home">
          Shoe Store
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
          className="relative hidden md:flex items-center bg-neutral-200 rounded-3xl shadow-sm overflow-hidden h-10 w-50"
        >
          <button
            type="submit"
            className="absolute left-4 text-gray-400"
            tabIndex={-1} // Prevents button from being tabbed to, as input is primary interaction
            aria-label="Tìm kiếm"
          >
            <HiMagnifyingGlass className="w-5 h-5 cursor-pointer" />
          </button>
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-3xl"
            aria-label="Desktop search input"
          />
        </form>

        {/* Mobile Search Icon: Visible only on small screens */}
        <button
          onClick={handleSearchToggle}
          className="md:hidden cursor-pointer hover:text-black p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle search bar"
        >
          <HiMagnifyingGlass className="h-6 w-6 text-gray-800" />
        </button>

        {/* Cart Icon */}
        <button className="cursor-pointer hover:text-black p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Shopping cart">
          <FaCartPlus className="h-6 w-6 text-gray-700" />
        </button>

        {/* Profile Icon */}
        <Link to="/profile" className="hover:text-black p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="User profile">
          <FaUser className="h-6 w-6 text-gray-700" />
        </Link>

        {/* Hamburger Menu Icon: Visible only on small screens */}
        <button
          onClick={handleMenuToggle}
          className="md:hidden cursor-pointer p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle navigation menu"
        >
          <GiHamburgerMenu className="text-2xl text-gray-800" />
        </button>
      </div>

      {/* Mobile Search Overlay: Appears when isSearchOpen is true */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center p-4 md:hidden transition-opacity duration-300 ease-in-out opacity-100">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full max-w-md bg-gray-100 rounded-full shadow-md overflow-hidden h-12"
          >
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-12 py-3 text-gray-700 placeholder-gray-400 focus:outline-none rounded-full focus:ring-2 focus:ring-blue-500"
              autoFocus // Automatically focuses the input when the overlay appears
              aria-label="Mobile search input"
            />
            <button
              type="submit"
              className="absolute right-4 text-gray-600 hover:text-gray-800 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Submit search"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </form>
          <button
            type="button"
            onClick={handleSearchToggle}
            className="mt-6 text-gray-600 hover:text-gray-800 text-lg flex items-center space-x-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close search"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay: Appears when menuOpen is true */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-30 flex flex-col items-center justify-center p-4 md:hidden transition-opacity duration-300 ease-in-out opacity-100">
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase py-3 text-lg" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase py-3 text-lg" onClick={() => setMenuOpen(false)}>Nam</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase py-3 text-lg" onClick={() => setMenuOpen(false)}>Nữ</Link>
          <Link to="#" className="text-gray-700 hover:text-black font-medium uppercase py-3 text-lg" onClick={() => setMenuOpen(false)}>Sale Off</Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="mt-8 text-gray-600 hover:text-gray-800 text-lg flex items-center space-x-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar