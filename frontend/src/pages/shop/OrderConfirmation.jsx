import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTruck } from 'react-icons/fa';

const OrderConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full bg-white p-8 md:p-12 border border-green-400 rounded-lg shadow-xl text-center">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6 animate-bounce-in" />
                
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                    Xác Nhận Đơn Hàng Thành Công!
                </h1>
                
                <p className="text-lg text-gray-700 mb-6">
                    Cảm ơn bạn! Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.
                </p>

                <div className="bg-green-50 p-6 rounded-md mb-8 text-left border-l-4 border-green-500">
                    <p className="text-md text-gray-800 mb-2 flex items-center">
                        <FaTruck className="text-green-600 mr-3 text-2xl" />
                        <strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                        Chúng tôi sẽ liên hệ lại với bạn để xác nhận thông tin đơn hàng và giao hàng trong thời gian sớm nhất. Vui lòng kiểm tra email hoặc điện thoại đã đăng ký.
                    </p>
                </div>
                
                <button
                    onClick={() => navigate('/order-history')}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Xem đơn hàng của tôi
                </button>
                <button
                    onClick={() => navigate('/collections')}
                    className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;