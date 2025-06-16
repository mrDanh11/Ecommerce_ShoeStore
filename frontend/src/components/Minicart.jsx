import { Link } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import toVND from '../utils/helper';

const Minicart = ({ handleTurnOffMinicart, minicartOpen, toggleMinicart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const CUSTOMER_ID = '5525453c-8f4e-4287-b380-ff1533826b56';

    // Hàm fetch Cart Items
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
                    _id: item.machitietgiohang,
                    productId: chiTiet.machitietsanpham,
                    tensanpham: sanpham.tensanpham,
                    description: sanpham.description,
                    anhsanpham: sanpham.anhsanpham,
                    color: chiTiet.color,
                    size: chiTiet.size,
                    gia: chiTiet.gia,
                    soluong: item.soluong,
                };
            });
            setCartItems(mappedItems);
        } catch (error) {
            console.error('Fetch error for Minicart:', error);
        } finally {
            setLoading(false); 
        }
    }, [CUSTOMER_ID]);

    useEffect(() => {
        if (minicartOpen) {
            fetchCartItems();
        }
    }, [minicartOpen, fetchCartItems]);

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);
    };

    const subtotal = calculateSubtotal();

    // Hàm xử lý xóa sản phẩm (DELETE)
    const handleRemoveItem = async (idToDelete) => { 
        try {
            const response = await fetch(`http://localhost:4004/v1/api/cart/${CUSTOMER_ID}/${idToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item from cart');
            }

            const updatedCartItems = cartItems.filter(item => item._id !== idToDelete);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from Minicart:', error);
            alert(`Lỗi khi xóa sản phẩm: ${error.message}`);
        }
    };

    // Hàm xử lý thay đổi số lượng (PUT)
    const handleQuantityChange = async (idToUpdate, newQty) => { 
        const parsedNewQty = parseInt(newQty) || 0;

        if (parsedNewQty <= 0) {
            handleRemoveItem(idToUpdate);
            return;
        }

        const currentItem = cartItems.find(item => item._id === idToUpdate);
        if (!currentItem || currentItem.soluong === parsedNewQty) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4004/v1/api/cart/${CUSTOMER_ID}/${idToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    soluong: parsedNewQty,
                    size: currentItem.size,
                    color: currentItem.color,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update quantity');
            }

            const updatedCartItems = cartItems.map(item =>
                item._id === idToUpdate
                    ? { ...item, soluong: parsedNewQty }
                    : item
            );
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error updating quantity in Minicart:', error);
            alert(`Lỗi khi cập nhật số lượng: ${error.message}`);
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-8">
                        <p className="text-lg">Đang tải giỏ hàng...</p>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-8">
                        <FaShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-lg">Hiện chưa có sản phẩm</p>
                    </div>
                ) : (
                    <div>
                        {cartItems.map((product) => (
                            <div key={product._id} className="flex justify-between py-4 border-b border-dotted border-gray-400">
                                <div className="flex items-start w-full">
                                    <img src={product.anhsanpham} alt={product.tensanpham} className="w-20 h-24 object-cover mr-4 rounded" />
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
                                                    onClick={() => handleQuantityChange(product._id, product.soluong - 1)}
                                                >
                                                    −
                                                </button>
                                                <span className="mx-3 text-sm text-gray-800">{product.soluong}</span>
                                                <button
                                                    className="border rounded px-2 py-0.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => handleQuantityChange(product._id, product.soluong + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="self-end text-sm font-medium text-gray-800 mb-1">{toVND(product.gia * product.soluong)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
    );
};

export default Minicart;