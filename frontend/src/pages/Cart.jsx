import { useEffect, useState, useCallback } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import toVND from '../utils/helper';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const CUSTOMER_ID = '5525453c-8f4e-4287-b380-ff1533826b56';
  
  // Hàm fetch Cart Items ban đầu
  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4004/v1/api/cart/${CUSTOMER_ID}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      const rawItems = data.data?.[0]?.giohang?.chitietgiohang || [];

      const mappedItems = rawItems.map(item => {
        const chiTiet = item.chitietsanpham;
        const sanpham = chiTiet.sanpham;

        return {
          productId: item.machitietgiohang,
          tensanpham: sanpham.tensanpham,
          description: sanpham.description,
          anhsanpham: sanpham.anhsanpham,
          color: chiTiet.color,
          size: chiTiet.size,
          gia: chiTiet.gia,
          soluong: item.soluong,
          isSelected: true,
        };
      });

      setCartItems(mappedItems);
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Lỗi khi tải giỏ hàng: ${error.message}`); 
    } finally {
      setLoading(false);
    }
  }, [CUSTOMER_ID]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Calculate subtotal only for selected items
  const subtotal = cartItems.reduce((sum, item) =>
    item.isSelected ? sum + item.gia * item.soluong : sum, 0);

  // Check if all items are selected
  const allItemsSelected = cartItems.length > 0 && cartItems.every(item => item.isSelected);

  // Hàm xử lý xóa sản phẩm (DELETE)
  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      return; // Người dùng hủy xóa
    }

    try {
      const response = await fetch(`http://localhost:4004/v1/api/cart/${CUSTOMER_ID}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }

      // Nếu xóa thành công ở backend, cập nhật lại trạng thái local
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
      alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
    } catch (error) {
      console.error('Error removing item:', error);
      alert(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  };

  // Hàm xử lý thay đổi số lượng (PUT)
  const handleQuantityChange = async (productId, newQty) => {
    const parsedNewQty = parseInt(newQty) || 0;

    if (parsedNewQty <= 0) {
      handleRemoveItem(productId); // Gọi hàm xóa nếu số lượng <= 0
      return;
    }

    // Tránh gọi API nếu số lượng không thay đổi
    const currentItem = cartItems.find(item => item.productId === productId);
    if (currentItem && currentItem.soluong === parsedNewQty) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4004/v1/api/cart/${CUSTOMER_ID}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
                soluong: parsedNewQty,
                size: currentItem.size,
                color: currentItem.color
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      // Nếu cập nhật thành công ở backend, cập nhật lại trạng thái local
      const updatedCartItems = cartItems.map(item =>
        item.productId === productId
          ? { ...item, soluong: parsedNewQty }
          : item
      );
      setCartItems(updatedCartItems);
      // alert('Số lượng sản phẩm đã được cập nhật!');
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(`Lỗi khi cập nhật số lượng: ${error.message}`);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (productId) => {
    const updatedCartItems = cartItems.map(item =>
      item.productId === productId
        ? { ...item, isSelected: !item.isSelected }
        : item
    );
    setCartItems(updatedCartItems);
  };

  // Handle select all items
  const handleSelectAllItems = () => {
    const newSelectAllState = !allItemsSelected; // Đây là vấn đề
    const updatedCartItems = cartItems.map(item => ({
      ...item,
      isSelected: newSelectAllState, // Đây là vấn đề
    }));
    setCartItems(updatedCartItems);
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto min-h-screen overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-8 uppercase">Giỏ hàng của bạn</h1>
        <div className="bg-gray-50 text-center py-20 rounded-lg shadow-sm">
          <p className="text-xl text-gray-700 mb-4">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );


  return (
    <div className="max-w-7xl mx-auto min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8 uppercase">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-lg">
          <p className="text-xl text-gray-700 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* List of products in cart */}
          <div className="flex-grow bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Sản phẩm trong giỏ</h2>
            {/* Select All checkbox */}
            <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
              <input
                type="checkbox"
                id="selectAll"
                checked={allItemsSelected}
                onChange={handleSelectAllItems}
                className="form-checkbox h-5 w-5 text-black rounded-sm border-gray-300 focus:ring-black cursor-pointer"
              />
              <label htmlFor="selectAll" className="ml-2 text-lg font-medium text-gray-800 cursor-pointer">
                Chọn tất cả ({cartItems.length} sản phẩm)
              </label>
            </div>

            {cartItems.map((product) => (
              <div key={product.productId} className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
                <input
                  type="checkbox"
                  checked={product.isSelected}
                  onChange={() => handleSelectItem(product.productId)}
                  className="form-checkbox h-5 w-5 text-black rounded-sm border-gray-300 focus:ring-black cursor-pointer mr-4"
                />
                <img src={product.anhsanpham} alt={product.tensanpham} className="w-24 h-28 object-cover mr-6 rounded" />
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
          <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg h-fit">
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

            <Link to="/checkout" className={`block ${subtotal === 0 ? 'pointer-events-none opacity-50' : ''}`}>
              <button
                className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-lg"
                aria-label="Đặt hàng ngay"
                disabled={subtotal === 0} // Disable if no items are selected
              >
                Thanh toán ({cartItems.filter(item => item.isSelected).length})
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