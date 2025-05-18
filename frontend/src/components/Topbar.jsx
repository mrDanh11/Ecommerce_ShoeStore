import { useState } from "react";
import { Link } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import Minicart from './Minicart';


const Topbar = () => {
  const [showMinicart, setShowMinicart] = useState(false);

  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-end items-center py-2 px-20 space-x-4">
        {/* Wish List */}
        <Link to="/" className="flex space-x-2">
          <IoHeart className="h-5 w-5 text-white" />
          <span className="text-sm hover:text-blue-200">Yêu thích</span>
        </Link>

        {/* User */}
        <Link to="/" className="flex space-x-2">
          <FaUser className="h-4.5 w-4.5 text-white" />
          <span className="text-sm hover:text-blue-200">Tài khoản</span>
        </Link>

        {/* Cart Icon + Minicart*/}
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setShowMinicart(true)}
          onMouseLeave={() => setShowMinicart(false)}
        >
          <Link to="/" className="flex space-x-2">
            <FaCartPlus className="h-4.5 w-4.5 text-white" />
            <span className="text-sm hover:text-blue-200">Giỏ hàng</span>
          </Link>

          {showMinicart && <Minicart />}
        </div>
      </div>
    </div>
  )
}

export default Topbar