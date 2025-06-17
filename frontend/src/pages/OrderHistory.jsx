import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaDollarSign, FaCalendarAlt, FaShippingFast, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";

// Dữ liệu giả định của bạn
const MOCK_ORDER_ITEMS = [
    {
        "mahoadon": "1b7f4354-e7f3-4f56-9602-8bc140d6d5be",
        "machitietsanpham": "e27c5c83-2042-44ab-bd84-897e18e164d8",
        "tongsoluong": 1,
        "tongtien": 90000,
        "hoadon": {
            "ngaydat": "2025-06-16",
            "payment": [
                {
                    "id": "6a6547b6-fe99-4de7-b0f1-61ee193bd45c",
                    "amount": 90000,
                    "status": "pending",
                    "paid_at": null,
                    "mahoadon": "1b7f4354-e7f3-4f56-9602-8bc140d6d5be",
                    "created_at": "2025-06-16T11:24:32.49331",
                    "phuongthuc": "VNPAY",
                    "updated_at": "2025-06-16T11:24:32.49331"
                }
            ],
            "voucher": null,
            "mahoadon": "1b7f4354-e7f3-4f56-9602-8bc140d6d5be",
            "shipment": {
                "sdt": "0987654321",
                "name": "Nguyễn Văn A",
                "trangthai": "Chưa/Đang Giao",
                "mashipment": "b68ac30c-a57b-4343-8f77-63c9393617ff",
                "makhachhang": "5525453c-8f4e-4287-b380-ff1533826b56",
                "mavanchuyen": "GIAOHANG111",
                "diachigiaohang": "Số 123, Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh"
            },
            "tongtien": 90000,
            "thanhtien": 90000,
            "mashipment": "b68ac30c-a57b-4343-8f77-63c9393617ff",
            "makhachhang": "5525453c-8f4e-4287-b380-ff1533826b56",
            "tongsoluong": 1
        },
        "chitietsanpham": {
            "gia": 90000,
            "size": "M",
            "color": "Đen",
            "sanpham": {
                "gia": 600000,
                "masanpham": "cbc546ee-8057-4a4d-b500-66bafd928b8e",
                "tinhtrang": "Còn hàng",
                "anhsanpham": "jacket.jpg",
                "tensanpham": "Áo Khoác Gió Unisex",
                "description": "Chống nắng, chống nước"
            },
            "soluong": 15,
            "masanpham": "cbc546ee-8057-4a4d-b500-66bafd928b8e",
            "machitietsanpham": "e27c5c83-2042-44ab-bd84-897e18e164d8"
        }
    },
    {
        "mahoadon": "29fa55d5-d81a-4955-ae46-01fe45f1773e",
        "machitietsanpham": "e27c5c83-2042-44ab-bd84-897e18e164d8",
        "tongsoluong": 1,
        "tongtien": 90000,
        "hoadon": {
            "ngaydat": "2025-06-15",
            "payment": [
                {
                    "id": "4b340d42-6984-4745-a074-f3f5a27ec0c1",
                    "amount": 90000,
                    "status": "paid",
                    "paid_at": "2025-06-15T10:00:00.000Z",
                    "mahoadon": "29fa55d5-d81a-4955-ae46-01fe45f1773e",
                    "created_at": "2025-06-16T11:28:23.798363",
                    "phuongthuc": "COD",
                    "updated_at": "2025-06-16T11:28:23.798363"
                }
            ],
            "voucher": null,
            "mahoadon": "29fa55d5-d81a-4955-ae46-01fe45f1773e",
            "shipment": {
                "sdt": "0123456789",
                "name": "Trần Thị B",
                "trangthai": "Hoàn thành",
                "mashipment": "92f44463-1ab0-4d47-8482-05aa9fa41c9c",
                "makhachhang": "5525453c-8f4e-4287-b380-ff1533826b56",
                "mavanchuyen": "GIAOHANG111",
                "diachigiaohang": "Số 456, Đường DEF, Phường Z, Quận K, TP. Hà Nội"
            },
            "tongtien": 90000,
            "thanhtien": 90000,
            "mashipment": "92f44463-1ab0-4d47-8482-05aa9fa41c9c",
            "makhachhang": "5525453c-8f4e-4287-b380-ff1533826b56",
            "tongsoluong": 1
        },
        "chitietsanpham": {
            "gia": 90000,
            "size": "M",
            "color": "Đen",
            "sanpham": {
                "gia": 600000,
                "masanpham": "cbc546ee-8057-4a4d-b500-66bafd928b8e",
                "tinhtrang": "Còn hàng",
                "anhsanpham": "shoes.jpg",
                "tensanpham": "Giày Thể Thao Cao Cấp",
                "description": "Thoải mái và bền bỉ"
            },
            "soluong": 15,
            "masanpham": "cbc546ee-8057-4a4d-b500-66bafd928b8e",
            "machitietsanpham": "e27c5c83-2042-44ab-bd84-897e18e164d8"
        }
    }
];


const OrderHistory = () => {
    // Set cứng URL cơ sở của backend và URL thư mục ảnh
    // Chúng ta vẫn giữ các biến này để khi bạn muốn chuyển lại sang fetch thật, chỉ cần thay đổi giá trị ở đây.
    const BACKEND_BASE_URL = "http://localhost:4004"; 
    const PRODUCT_IMAGE_BASE_URL = `${BACKEND_BASE_URL}/images/products`; 

    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm mô phỏng việc gọi API bằng cách sử dụng mock data
    const getMockUserOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // Giả lập độ trễ mạng để thấy hiệu ứng loading
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            // Sử dụng dữ liệu giả thay vì fetch API
            const resData = {
                success: true,
                errorCode: 1,
                data: MOCK_ORDER_ITEMS
            };

            if (resData.success && resData.errorCode === 1) {
                // Chuyển đổi dữ liệu để dễ hiển thị, giống như khi fetch thật
                const transformedOrders = resData.data.map(orderItem => ({
                    mahoadon: orderItem.mahoadon,
                    tensanpham: orderItem.chitietsanpham.sanpham.tensanpham,
                    image: orderItem.chitietsanpham.sanpham.anhsanpham,
                    price: orderItem.chitietsanpham.gia,
                    quantity: orderItem.tongsoluong,
                    size: orderItem.chitietsanpham.size,
                    color: orderItem.chitietsanpham.color,
                    date: orderItem.hoadon.ngaydat,
                    paymentMethod: orderItem.hoadon.payment[0]?.phuongthuc || "Không xác định",
                    paymentStatus: orderItem.hoadon.payment[0]?.status || "Không xác định",
                    shipmentStatus: orderItem.hoadon.shipment.trangthai,
                    address: orderItem.hoadon.shipment.diachigiaohang,
                    sdt: orderItem.hoadon.shipment.sdt,
                    customerName: orderItem.hoadon.shipment.name,
                    tongtien: orderItem.tongtien,
                }));
                setOrderData(transformedOrders.reverse());
            } else {
                setError(resData.message || "Không thể lấy dữ liệu đơn hàng từ mock data.");
            }
        } catch (err) {
            console.error("Lỗi khi xử lý mock data:", err);
            setError(err.message || "Đã xảy ra lỗi không mong muốn khi dùng mock data.");
        } finally {
            setLoading(false);
        }
    };

    // Effect để gọi hàm lấy dữ liệu giả khi component mount
    useEffect(() => {
        getMockUserOrders();
    }, []); 

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
                    <p className="mt-4 text-xl text-gray-700">Đang tải lịch sử đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Lỗi!</h3>
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <button
                        onClick={getMockUserOrders}
                        className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (orderData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <FaBoxOpen className="text-gray-500 text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600 mb-4">Có vẻ bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!</p>
                    <Link
                        to="/collections"
                        className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                        Bắt đầu mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <main className='container mx-auto p-4 md:py-16'>
            <div className='text-center mb-8'>
                <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight'>
                    LỊCH SỬ <span className='text-blue-600'>ĐƠN HÀNG CỦA TÔI</span>
                </h1>
                <p className="text-lg text-gray-600 mt-2">Xem lại các đơn hàng bạn đã đặt</p>
            </div>

            <div className='space-y-6'>
                {orderData.map((item, i) => (
                    <div key={i} className='bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow duration-300'>
                        <div className='flex items-start gap-6 flex-grow'>
                            <img 
                                className='w-24 h-24 object-cover rounded-md flex-shrink-0' 
                                src={`${PRODUCT_IMAGE_BASE_URL}/${item.image}`} 
                                alt={item.tensanpham} 
                            />
                            <div className='flex-grow'>
                                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-1'>{item.tensanpham}</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-sm text-gray-700'>
                                    <p className='flex items-center'><FaDollarSign className='mr-2 text-blue-500' /> Giá: <span className="font-medium ml-1">{formatCurrency(item.price)}</span></p>
                                    <p className='flex items-center'><FaBoxOpen className='mr-2 text-green-500' /> Số lượng: <span className="font-medium ml-1">{item.quantity}</span></p>
                                    <p>Kích cỡ: <span className="font-medium">{item.size}</span></p>
                                    <p>Màu sắc: <span className="font-medium">{item.color}</span></p>
                                    <p className='flex items-center'><FaCalendarAlt className='mr-2 text-purple-500' /> Ngày đặt: <span className="font-medium ml-1">{new Date(item.date).toLocaleDateString('vi-VN')}</span></p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='md:w-auto flex flex-col items-start md:items-end gap-3 md:ml-4'>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${item.shipmentStatus === 'Hoàn thành' ? 'bg-green-500' : 'bg-orange-500'}`}></p>
                                <p className='text-sm md:text-base font-medium text-gray-700'>Trạng thái giao hàng: <span className="font-semibold">{item.shipmentStatus}</span></p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${item.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}></p>
                                <p className='text-sm md:text-base font-medium text-gray-700'>Thanh toán: <span className="font-semibold">{item.paymentMethod} ({item.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'})</span></p>
                            </div>
                            <p className='text-sm md:text-base font-medium text-gray-700 flex items-center'><FaMapMarkerAlt className="mr-2 text-gray-500" /> Địa chỉ: <span className="ml-1">{item.address}</span></p>
                            <p className='text-sm md:text-base font-medium text-gray-700 flex items-center'><FaShippingFast className="mr-2 text-gray-500" /> Người nhận: <span className="ml-1">{item.customerName} ({item.sdt})</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default OrderHistory;