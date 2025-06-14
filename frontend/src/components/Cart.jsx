import { useEffect } from 'react'
import { useState } from 'react'
import { FaTrashAlt } from "react-icons/fa"
import { Link } from 'react-router-dom' 

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4004/v1/api/cart/3fe55df8-db5f-496c-88f7-9e57c1affb79')
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
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, []);

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

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);
  };

  const subtotal = calculateSubtotal();

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

  if (loading) 
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">Giỏ hàng của bạn</h1>
        <div className="text-center py-20 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-xl text-gray-700 mb-4">Đang tải giỏ hàng...</p>
        </div>
      </div>
    ) 
  

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 uppercase">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-gray-700 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* List of products in cart */}
          <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Sản phẩm trong giỏ</h2>
            {cartItems.map((product) => (
              <div key={product.productId} className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
                <img href={product.anhsanpham} alt={product.tensanpham} className="w-24 h-28 object-cover mr-6 rounded" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.tensanpham}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.color} / Size {product.size}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
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
                    <p className="text-md font-medium text-gray-800">{toVND(product.gia * product.soluong)}</p>
                  </div>
                </div>
                <button
                    className="ml-auto text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    onClick={() => handleRemoveItem(product.productId)}
                >
                  <FaTrashAlt className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order information */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Thông tin đơn hàng</h2>
            <div className="space-y-4 text-gray-700 border-b pb-4">
              <div className="flex justify-between">
                <span className="font-bold">Tổng tiền: </span>
                <span className="font-semibold">{toVND(subtotal)}</span>
              </div>
            </div>
            <ul className="text-sm text-gray-600 list-disc pl-5 mt-4 mb-2 space-y-2">
              <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
              <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
            </ul>
            
            <Link to="/shipping-information" className="block">
              <button
                className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-lg"
                aria-label="Đặt hàng ngay"
              >
                ĐẶT HÀNG NGAY
              </button>
            </Link>
            <Link to="/" className="block text-center mt-4 text-sm text-blue-600 hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;