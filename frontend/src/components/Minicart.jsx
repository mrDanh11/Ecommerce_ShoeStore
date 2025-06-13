import { Link } from 'react-router-dom'
import { IoMdClose } from "react-icons/io"
import { useState, useEffect } from 'react'
import { FaShoppingCart } from "react-icons/fa"

const Minicart = ({ handleTurnOffMinicart, minicartOpen, toggleMinicart }) => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    fetch('http://localhost:4004/v1/api/cart/0a1faa54-1e4e-4634-b394-835931d1e31a')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const rawItems = data.data?.[0]?.giohang?.chitietgiohang || [];

        const mappedItems = rawItems.map(item => {
          const chiTiet = item.chitietsanpham;
          const sanpham = chiTiet.sanpham;

          return {
            productId: chiTiet.machitietgiohang,
            tensanpham: sanpham.tensanpham,
            description: sanpham.description,
            anhsanpham: sanpham.anhsanpham,
            color: chiTiet.color,
            size: chiTiet.size,
            gia: item.gia,
            soluong: item.soluong,
          };
        });

        setCartItems(mappedItems);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);
  };

  const subtotal = calculateSubtotal();

  const toVND = (value) => {
    value = value.toString().replace(/\./g, "");
    const formatted = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
      })
      .format(value)
      .replace("₫", "")
      .trim();
    
    return formatted
  }
    
  const handleRemoveItem = (productId) => {
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);
  };

  const handleQuantityChange = (productId, newQty) => {
    const parsedNewQty = parseInt(newQty) || 0;

    if (parsedNewQty <= 0) {
      handleRemoveItem(productId);
    } else {
      const updatedCartItems = cartItems.map(item =>
        item.productId === productId
          ? { ...item, soluong: parsedNewQty }
          : item
      );
      setCartItems(updatedCartItems);
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-6/7 sm:w-3/5 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
      minicartOpen ? "translate-x-0" : "translate-x-full"
    }`}>

      {/* Close Button */}
      <div className="flex justify-end pt-4 pr-4">
        <button className="cursor-pointer" onClick={toggleMinicart}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart contents with scrollable area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="border-b border-gray-400">
          <h2 className="text-center text-xl font-semibold mb-4 uppercase">Giỏ hàng</h2>
        </div>
        <div>
          { cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-8">
              <FaShoppingCart className="w-16 h-16 text-gray-400 mb-4" /> {/* Icon giỏ hàng */}
              <p className="text-lg">Hiện chưa có sản phẩm</p> {/* Thông báo giỏ hàng trống */}
            </div>
          ) : (
            cartItems.map((product, index) => (
              <div key={index} className="flex justify-between py-4 border-b border-dotted border-gray-400">
                <div className="flex items-start w-full">
                  <img href={product.anhsanpham} alt={product.tensanpham} className="w-20 h-24 object-cover mr-4 rounded" />
                  <div className="flex flex-col justify-between h-full w-full">
                    <div>
                      <h3 className="block text-sm font-semibold text-gray-700">
                      {product.tensanpham}
                      </h3>
                      <p className="block text-xs text-gray-600">
                        {product.color} / {product.size} 
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center mt-2">
                        <button
                          className="border rounded px-2 py-0.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleQuantityChange(product.productId, product.soluong - 1)}
                        >
                          −
                        </button>
                        <span className="mx-3 text-sm text-gray-800">{product.soluong}</span>
                        <button
                          className="border rounded px-2 py-0.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleQuantityChange(product.productId, product.soluong + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="self-end text-sm font-medium text-gray-800 mb-1">{toVND(product.gia * product.soluong)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subtotal and Navigate To Cart Page Button at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        <div className="border-t border-gray-400 pt-4 mt-4"></div>
        {/* Subtotal */}
        <div className="mb-4 text-sm text-gray-800 font-bold">
          <div className="flex justify-between">
            <span>TỔNG TIỀN:</span>
            <span className="font-bold text-red-500">{toVND(subtotal)}</span>
          </div>
        </div>

        {/* Navigate to cart page */}
        <Link to="/cart" className="block" onClick={handleTurnOffMinicart}>
          <button
            className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-102 shadow-lg"
            aria-label="Xem giỏ hàng"
          >
            XEM GIỎ HÀNG
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Minicart
