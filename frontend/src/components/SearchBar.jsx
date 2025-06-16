import { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2"

const SearchBar = ({ isOpen, onClose, onSubmit, searchTerm, setSearchTerm }) => {

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(searchTerm);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 flex items-center justify-center z-45 transition-opacity duration-300">
      <form
        onSubmit={handleFormSubmit}
        className="relative flex items-center justify-center w-full px-4"
      >
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 px-4 py-3 pl-12 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-lg placeholder:text-gray-500"
            autoFocus // Tự động focus khi mở
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            aria-label="Thực hiện tìm kiếm"
          >
            <HiMagnifyingGlass className="h-6 w-6" />
          </button>
        </div>
        <button
          type="button" // Quan trọng: type="button" để không submit form
          onClick={onClose} // Gọi hàm onClose được truyền từ Navbar
          className="ml-4 p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          aria-label="Đóng tìm kiếm"
        >
          <HiMiniXMark className="h-8 w-8" />
        </button>
      </form>
    </div>
  )
}

export default SearchBar