import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaCalendarAlt, FaShippingFast, FaMapMarkerAlt, FaExclamationTriangle } from "react-icons/fa";
import toVND from '../utils/helper'; // Assuming this utility function is available

const OrderHistory = () => {
    const CUSTOMER_ID = localStorage.getItem("customerId");
    const API_BASE_URL = "http://localhost:4004/v1/api/order/userorder";

    const [rawData, setRawData] = useState([]); // Stores all fetched data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for filters
    const [shipmentStatusFilter, setShipmentStatusFilter] = useState("");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // States for client-side pagination
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed page
    const pageSize = 5; // You can adjust this client-side page size

    // Function to fetch all orders for the customer
    const fetchUserOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!CUSTOMER_ID) {
                throw new Error("Không tìm thấy Customer ID trong localStorage. Vui lòng đăng nhập.");
            }

            // Construct the URL with CUSTOMER_ID in the path
            const url = `${API_BASE_URL}/${CUSTOMER_ID}`;

            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const json = await res.json();

            if (json.success && json.errorCode === 1) {
                setRawData(json.data); // Store all data
                setError(null);
            } else {
                throw new Error(json.message || "Không thể lấy dữ liệu đơn hàng.");
            }
        } catch (err) {
            console.error("Lỗi khi fetch dữ liệu đơn hàng:", err);
            setError(err.message || "Đã xảy ra lỗi không mong muốn.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data only once when the component mounts or CUSTOMER_ID changes
    useEffect(() => {
        fetchUserOrders();
    }, [CUSTOMER_ID]);

    // Memoize filtered and paginated data for performance
    const filteredAndGroupedOrders = useMemo(() => {
        let filteredData = rawData;

        // Apply shipment status filter
        if (shipmentStatusFilter) {
            filteredData = filteredData.filter(item =>
                item.hoadon?.shipment?.trangthai === shipmentStatusFilter
            );
        }

        // Apply payment status filter
        if (paymentStatusFilter) {
            filteredData = filteredData.filter(item =>
                item.hoadon?.payment?.[0]?.status === paymentStatusFilter
            );
        }

        // Apply date range filter
        if (fromDate) {
            const from = new Date(fromDate);
            filteredData = filteredData.filter(item => {
                const orderDate = new Date(item.hoadon?.ngaydat);
                return orderDate >= from;
            });
        }
        if (toDate) {
            const to = new Date(toDate);
            // Set time to end of day for 'toDate' to include orders on that day
            to.setHours(23, 59, 59, 999);
            filteredData = filteredData.filter(item => {
                const orderDate = new Date(item.hoadon?.ngaydat);
                return orderDate <= to;
            });
        }

        // Group the filtered data
        const groupedOrders = {};
        filteredData.forEach(item => {
            const orderId = item.mahoadon;
            if (!groupedOrders[orderId]) {
                groupedOrders[orderId] = {
                    mahoadon: orderId,
                    date: item.hoadon?.ngaydat || "Không có ngày đặt",
                    paymentMethod: item.hoadon?.payment?.[0]?.phuongthuc || "Không xác định",
                    paymentStatus: item.hoadon?.payment?.[0]?.status || "Không xác định",
                    shipmentStatus: item.hoadon?.shipment?.trangthai || "Không xác định",
                    address: item.hoadon?.shipment?.diachigiaohang || "Không có địa chỉ",
                    sdt: item.hoadon?.shipment?.sdt || "Không có SĐT",
                    customerName: item.hoadon?.shipment?.name || "Không có tên khách hàng",
                    tongtien: item.hoadon?.tongtien || 0,
                    products: []
                };
            }
            groupedOrders[orderId].products.push({
                machitietsanpham: item.machitietsanpham,
                tensanpham: item.chitietsanpham?.sanpham?.tensanpham || "Không xác định",
                image: item.chitietsanpham?.sanpham?.anhsanpham || "",
                price: item.chitietsanpham?.gia || 0,
                quantity: item.tongsoluong,
                size: item.chitietsanpham?.size || "N/A",
                color: item.chitietsanpham?.color || "N/A",
            });
        });

        // Convert to array and reverse to show newest first
        const ordersArray = Object.values(groupedOrders).reverse();

        // Client-side pagination
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return ordersArray.slice(startIndex, endIndex);

    }, [rawData, shipmentStatusFilter, paymentStatusFilter, fromDate, toDate, currentPage]);

    // Calculate total pages for client-side pagination
    const totalFilteredOrders = useMemo(() => {
        let countFilteredData = rawData;
        // Re-apply filters to get the total count for pagination
        if (shipmentStatusFilter) {
            countFilteredData = countFilteredData.filter(item =>
                item.hoadon?.shipment?.trangthai === shipmentStatusFilter
            );
        }
        if (paymentStatusFilter) {
            countFilteredData = countFilteredData.filter(item =>
                item.hoadon?.payment?.[0]?.status === paymentStatusFilter
            );
        }
        if (fromDate) {
            const from = new Date(fromDate);
            countFilteredData = countFilteredData.filter(item => {
                const orderDate = new Date(item.hoadon?.ngaydat);
                return orderDate >= from;
            });
        }
        if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            countFilteredData = countFilteredData.filter(item => {
                const orderDate = new Date(item.hoadon?.ngaydat);
                return orderDate <= to;
            });
        }

        const uniqueOrderIds = new Set(countFilteredData.map(item => item.mahoadon));
        return uniqueOrderIds.size; // Count unique orders after filtering
    }, [rawData, shipmentStatusFilter, paymentStatusFilter, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(totalFilteredOrders / pageSize));

    // Event handlers for filters and pagination
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleShipmentStatusChange = (e) => {
        setShipmentStatusFilter(e.target.value);
        setCurrentPage(0); // Reset page when filter changes
    };

    const handlePaymentStatusChange = (e) => {
        setPaymentStatusFilter(e.target.value);
        setCurrentPage(0); // Reset page when filter changes
    };

    const handleFromDateChange = (e) => {
        setFromDate(e.target.value);
        setCurrentPage(0);
    };

    const handleToDateChange = (e) => {
        setToDate(e.target.value);
        setCurrentPage(0);
    };

    // New function to clear all filters
    const clearAllFilters = () => {
        setShipmentStatusFilter("");
        setPaymentStatusFilter("");
        setFromDate("");
        setToDate("");
        setCurrentPage(0); // Reset page to 0
    };

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
                        onClick={fetchUserOrders} // Re-fetch all data on retry
                        className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Determine if any filters are currently active
    const isAnyFilterActive = shipmentStatusFilter || paymentStatusFilter || fromDate || toDate;

    // Condition for displaying no orders found
    if (filteredAndGroupedOrders.length === 0 && !loading && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
                    <FaBoxOpen className="text-gray-500 text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {isAnyFilterActive ? "Không tìm thấy đơn hàng nào với bộ lọc này" : "Chưa có đơn hàng nào"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {isAnyFilterActive
                            ? "Vui lòng điều chỉnh các bộ lọc để xem các đơn hàng khác hoặc xóa bộ lọc."
                            : "Có vẻ bạn chưa thực hiện đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!"
                        }
                    </p>
                    {isAnyFilterActive ? (
                        <button
                            onClick={clearAllFilters} // Call function to clear filters
                            className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Xóa bộ lọc và xem tất cả
                        </button>
                    ) : (
                        <Link
                            to="/collections" // Only go to collections if genuinely no orders
                            className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Bắt đầu mua sắm
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-10 border-t max-w-7xl mx-auto min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8">
            <div className='text-center mb-8'>
                <h1 className='text-2xl font-extrabold text-gray-900 leading-tight'>
                    LỊCH SỬ ĐƠN HÀNG CỦA BẠN
                </h1>
                <p className="text-lg text-gray-600 mt-2">Xem lại các đơn hàng bạn đã đặt</p>
            </div>

            {/* Các bộ lọc */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="shipmentStatus" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái vận chuyển:</label>
                    <select id="shipmentStatus" value={shipmentStatusFilter} onChange={handleShipmentStatusChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm">
                        <option value="">Tất cả</option>
                        <option value="Chưa/Đang Giao">Chưa/Đang Giao</option>
                        <option value="Đã Giao">Đã Giao</option>
                        <option value="Đã Hủy">Đã Hủy</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán:</label>
                    <select id="paymentStatus" value={paymentStatusFilter} onChange={handlePaymentStatusChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm">
                        <option value="">Tất cả</option>
                        <option value="pending">Chưa thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="failed">Thất bại</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">Từ ngày:</label>
                    <input type="date" id="fromDate" value={fromDate} onChange={handleFromDateChange}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm" />
                </div>

                <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">Đến ngày:</label>
                    <input type="date" id="toDate" value={toDate} onChange={handleToDateChange}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm" />
                </div>
            </div>

            <div className='space-y-8'>
                {filteredAndGroupedOrders.map((order) => (
                    <div key={order.mahoadon} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
                        {/* Header của từng hóa đơn */}
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Đơn hàng #{order.mahoadon.substring(0, 8)}...</h2> {/* Rút gọn ID */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 text-sm text-gray-700'>
                                <p className='flex items-center'><FaCalendarAlt className='mr-2 text-purple-500' /> Ngày đặt: <span className="font-medium ml-1">{new Date(order.date).toLocaleDateString('vi-VN')}</span></p>
                                <p className='flex items-center'>
                                    <span className={`min-w-2 h-2 rounded-full mr-2 ${order.shipmentStatus === 'Đã Giao' ? 'bg-green-500' : (order.shipmentStatus === 'Đã Hủy' ? 'bg-red-500' : 'bg-orange-500')}`}></span>
                                    Trạng thái giao hàng: <span className="font-semibold ml-1">{order.shipmentStatus}</span>
                                </p>
                                <p className='flex items-center'>
                                    <span className={`min-w-2 h-2 rounded-full mr-2 ${order.paymentStatus === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    Thanh toán: <span className="font-semibold ml-1">{order.paymentMethod} ({order.paymentStatus === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'})</span>
                                </p>
                                <p className='flex items-center col-span-1 md:col-span-2 lg:col-span-3'><FaMapMarkerAlt className="mr-2 text-gray-500" /> Địa chỉ: <span className="ml-1">{order.address}</span></p>
                                <p className='flex items-center col-span-1 md:col-span-2 lg:col-span-3'><FaShippingFast className="mr-2 text-gray-500" /> Người nhận: <span className="ml-1">{order.customerName} ({order.sdt})</span></p>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm trong hóa đơn */}
                        <div className="space-y-4">
                            {order.products.map((product) => (
                                <div key={product.machitietsanpham} className='flex items-start gap-4 p-4 bg-gray-50 rounded-md border border-gray-200'>
                                    <img
                                        className='w-20 h-20 object-cover rounded-md flex-shrink-0'
                                        src={product.image}
                                        alt={product.tensanpham}
                                    />
                                    <div className='flex-grow'>
                                        <h4 className='text-md font-semibold text-gray-800 mb-1'>{product.tensanpham}</h4>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-600'>
                                            <p>Giá: <span className="font-medium">{toVND(product.price)}</span></p>
                                            <p>Số lượng: <span className="font-medium">{product.quantity}</span></p>
                                            <p>Kích cỡ: <span className="font-medium">{product.size}</span></p>
                                            <p>Màu sắc: <span className="font-medium">{product.color}</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tổng tiền của hóa đơn */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <p className="text-xl font-bold text-gray-800">
                                Tổng tiền: {toVND(order.tongtien)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && ( // Chỉ hiển thị phân trang nếu có nhiều hơn 1 trang
                <div className="flex justify-center items-center mt-8 space-x-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        Trước
                    </button>
                    <span className="text-gray-700 font-medium">
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        Tiếp
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
