// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate, Link } from 'react-router-dom';
// import toVND from '../utils/helper.js';
// import { BsCashCoin } from "react-icons/bs";
// import vnpaylogo from '../assets/VNPay-Logo.svg';
// import vietnamLocations from '../data/vietnamLocations';

// const CheckoutPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [selectedItems, setSelectedItems] = useState([]);

//     const [fullName, setFullName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [district, setDistrict] = useState('');
//     const [ward, setWard] = useState('');

//     const [voucherCode, setVoucherCode] = useState('');
//     const [discountAmount, setDiscountAmount] = useState(0);

//     const [shippingFee, setShippingFee] = useState(30000);
//     const [paymentMethod, setPaymentMethod] = useState('COD');

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [availableDistricts, setAvailableDistricts] = useState([]);
//     const [availableWards, setAvailableWards] = useState([]);

//     // ID khách hàng
//     const CUSTOMER_ID = '5525453c-8f4e-4287-b380-ff1533826b56'; 

//     // Lấy dữ liệu sản phẩm đã chọn từ state của Link khi component mount
//     useEffect(() => {
//         if (location.state && location.state.selectedCartItems) {
//             setSelectedItems(location.state.selectedCartItems);
//             // Nếu không có sản phẩm nào được chọn, chuyển hướng về giỏ hàng
//             if (location.state.selectedCartItems.length === 0) {
//                 navigate('/cart');
//                 alert('Vui lòng chọn sản phẩm để thanh toán.');
//             }
//         } else {
//             // Nếu không có dữ liệu state (người dùng truy cập trực tiếp URL /checkout)
//             navigate('/cart');
//             alert('Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng.');
//         }
//     }, [location.state, navigate]); 

//     // Effect để cập nhật danh sách quận/huyện khi tỉnh/thành thay đổi
//     useEffect(() => {
//         if (city) {
//             const selectedCity = vietnamLocations.find(loc => loc.value === city);
//             setAvailableDistricts(selectedCity ? selectedCity.districts : []);
//             setDistrict(''); // Reset district khi đổi city
//             setWard('');     // Reset ward khi đổi city
//         } else {
//             setAvailableDistricts([]);
//             setDistrict('');
//             setWard('');
//         }
//     }, [city]);

//     // Effect để cập nhật danh sách phường/xã khi quận/huyện thay đổi
//     useEffect(() => {
//         if (district) {
//             const selectedCity = vietnamLocations.find(loc => loc.value === city);
//             if (selectedCity) {
//                 const selectedDistrict = selectedCity.districts.find(dist => dist.value === district);
//                 setAvailableWards(selectedDistrict ? selectedDistrict.wards : []);
//                 setWard(''); // Reset ward khi đổi district
//             }
//         } else {
//             setAvailableWards([]);
//             setWard('');
//         }
//     }, [district, city]); // Cần theo dõi cả city vì district phụ thuộc vào city

//     // Tính toán tổng tiền của các sản phẩm đã chọn
//     const subtotal = selectedItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);

//     const total = subtotal - discountAmount + shippingFee;

//     const handleApplyVoucher = () => {
//         console.log('Applying voucher:', voucherCode);
//         // Reset error message
//         setError(null);

//         // Logic demo áp dụng voucher
//         let appliedDiscount = 0;
//         if (voucherCode === 'T625HE120KM') {
//             appliedDiscount = 120000;
//         } else if (voucherCode === 'T625HE80KM') {
//             appliedDiscount = 80000;
//         } else if (voucherCode === 'T625HE40KM') {
//             appliedDiscount = 40000;
//         } else if (voucherCode === 'FREESHIPLSFKM') {
//             // Giả định voucher này giảm phí ship
//             setShippingFee(0);
//             alert('Voucher FREESHIPLSFKM đã được áp dụng! Phí vận chuyển đã được miễn phí.');
//             return; 
//         } else {
//             setError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
//         }

//         setDiscountAmount(appliedDiscount);
//     };

//     const handleRemoveVoucher = () => {
//         setVoucherCode('');
//         setDiscountAmount(0);
//         setShippingFee(30000);
//         setError(null);
//     };

//     // Hàm xử lý đặt hàng (gọi API)
//     const handlePlaceOrder = async (e) => {
//         e.preventDefault();

//         if (selectedItems.length === 0) {
//             setError('Không có sản phẩm nào để đặt hàng.');
//             return;
//         }

//         // Kiểm tra các trường thông tin giao hàng bắt buộc
//         if (!fullName || !phone || !address || !city || !district || !ward) {
//             setError('Vui lòng điền đầy đủ thông tin giao hàng.');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         const cityDisplayName = vietnamLocations.find(loc => loc.value === city)?.name || city;
//         const districtDisplayName = availableDistricts.find(dist => dist.value === district)?.name || district;
//         const wardDisplayName = availableWards.find(w => w.value === ward)?.name || ward;

//         // Chuẩn bị dữ liệu cho API POST
//         const orderData = {
//             customerid: CUSTOMER_ID,
//             items: selectedItems.map(item => ({
//                 productid: item.productId,
//                 quantity: item.soluong,
//                 price: item.gia,
//             })),
//             address: `[${address}] ${wardDisplayName} ${districtDisplayName}, ${cityDisplayName}`,
//             name: fullName,
//             sdt: phone,
//             paymentmethod: paymentMethod,
//             voucher: voucherCode || null, // Gửi null nếu không có voucher
//         };

//         try {
//             const response = await fetch('http://localhost:4004/v1/api/order/checkout', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     // 'Authorization': `Bearer ${yourAuthToken}`,
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             if (!response.ok) {
//                 const errorResponse = await response.json();
//                 throw new Error(errorResponse.message || 'Đặt hàng thất bại.');
//             }

//             const successData = await response.json();
//             alert(successData.message + '. Mã đơn hàng của bạn: ' + successData.orderid);
//             // Chuyển hướng đến trang xác nhận đơn hàng
//             navigate('/order-confirmation', { state: { orderId: successData.orderid } });

//         } catch (err) {
//             console.error('Lỗi đặt hàng:', err);
//             setError(err.message || 'Có lỗi xảy ra khi đặt hàng.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <div className="text-center py-20 text-xl font-semibold">Đang xử lý đơn hàng của bạn...</div>;


//     return (
//         <div className="min-h-screen py-8 px-4 lg:px-8">
//             <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="flex flex-col-reverse lg:flex-row">
//                     {/* Left Section: Shipping Information */}
//                     <div className="lg:w-3/5 p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
//                         <div className="text-sm text-gray-500 mb-6 flex space-x-2">
//                             <Link to="/cart" className="text-blue-600 font-semibold hover:underline">Giỏ hàng</Link>
//                             <span className="font-bold">&gt;</span>
//                             <span className="text-blue-600 font-semibold">Thanh toán</span>
//                         </div>

//                         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin giao hàng</h2>

//                         {/* Shipping Address Form */}
//                         <form onSubmit={handlePlaceOrder} className="space-y-4">
//                             <div>
//                                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
//                                 <input
//                                     type="text"
//                                     id="phone"
//                                     placeholder="Số điện thoại"
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     value={phone}
//                                     onChange={(e) => setPhone(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Người nhận</label>
//                                 <input
//                                     type="text"
//                                     id="fullName"
//                                     placeholder="Họ và tên"
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     value={fullName}
//                                     onChange={(e) => setFullName(e.target.value)}
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
//                                 <input
//                                     type="text"
//                                     id="address"
//                                     placeholder="Địa chỉ"
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     value={address}
//                                     onChange={(e) => setAddress(e.target.value)}
//                                     required
//                                 />
//                             </div>

//                             {/* Tỉnh Thành, Quận Huyện, Phường Xã Dropdowns */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh / thành</label>
//                                     <select
//                                         id="city"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                         value={city}
//                                         onChange={(e) => setCity(e.target.value)}
//                                         required
//                                     >
//                                         <option value="">Chọn tỉnh / thành</option>
//                                         {vietnamLocations.map((loc) => (
//                                             <option key={loc.value} value={loc.value}>
//                                                 {loc.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận / huyện</label>
//                                     <select
//                                         id="district"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                         value={district}
//                                         onChange={(e) => setDistrict(e.target.value)}
//                                         required
//                                         disabled={availableDistricts.length === 0}
//                                     >
//                                         <option value="">Chọn quận / huyện</option>
//                                         {availableDistricts.map((dist) => (
//                                             <option key={dist.value} value={dist.value}>
//                                                 {dist.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường / xã</label>
//                                     <select
//                                         id="ward"
//                                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                         value={ward}
//                                         onChange={(e) => setWard(e.target.value)}
//                                         required
//                                         disabled={availableWards.length === 0}
//                                     >
//                                         <option value="">Chọn phường / xã</option>
//                                         {availableWards.map((w) => (
//                                             <option key={w.value} value={w.value}>
//                                                 {w.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Payment Method Section */}
//                             <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-8">Phương thức thanh toán</h2>
//                             <div className="space-y-4">
//                                 {/* COD Option */}
//                                 <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
//                                     <input
//                                         type="radio"
//                                         name="paymentMethod"
//                                         value="COD"
//                                         checked={paymentMethod === 'COD'}
//                                         onChange={() => setPaymentMethod('COD')}
//                                         className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
//                                     />
//                                     <span className="ml-3 text-gray-800 font-medium">Thanh toán khi nhận hàng (COD)</span>
//                                     <span className="ml-auto text-gray-500 text-sm">
//                                         <BsCashCoin className="h-5 w-5 inline-block mr-2.5" />
//                                     </span>
//                                 </label>

//                                 {/* VNPAY Option */}
//                                 <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
//                                     <input
//                                         type="radio"
//                                         name="paymentMethod"
//                                         value="VNPAY"
//                                         checked={paymentMethod === 'VNPAY'}
//                                         onChange={() => setPaymentMethod('VNPAY')}
//                                         className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
//                                     />
//                                     <span className="ml-3 text-gray-800 font-medium">Thanh toán qua VNPay</span>
//                                     <span className="ml-auto w-20 h-8 flex items-center justify-end overflow-hidden">
//                                         <img src={vnpaylogo} alt="VNPay Logo" className="w-1/2 h-full object-contain" />
//                                     </span>
//                                 </label>
//                             </div>

//                             {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//                             <div className="flex items-center justify-between mt-10">
//                                 <Link to="/cart" className="block text-center text-base font-medium text-black hover:underline">
//                                     Quay về giỏ hàng
//                                 </Link>
//                                 <button
//                                     type="submit"
//                                     className="cursor-pointer w-auto bg-black text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-lg"
//                                     aria-label="Hoàn tất đơn hàng"
//                                     disabled={loading} 
//                                 >
//                                     {loading ? 'Đang xử lý...' : 'Hoàn tất đơn hàng'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>

//                     {/* Right Section: Order Summary */}
//                     <div className="lg:w-2/5 p-8 bg-gray-50 border-b border-gray-200 lg:border-b-0">
//                         {/* Product List */}
//                         <h2 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng ({selectedItems.length} sản phẩm)</h2>
//                         <div className="space-y-6 mb-6 border-t border-gray-300 pt-6 max-h-60 overflow-y-auto">
//                             {selectedItems.length === 0 ? (
//                                 <p className="text-gray-600 text-center">Không có sản phẩm nào trong đơn hàng.</p>
//                             ) : (
//                                 selectedItems.map((product) => (
//                                     <div key={product.productId} className="flex items-center">
//                                         <div className="relative mr-4 flex-shrink-0">
//                                             <img src={product.anhsanpham} alt={product.tensanpham} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
//                                             <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                                                 {product.soluong}
//                                             </span>
//                                         </div>
//                                         <div className="flex-grow"> 
//                                             <h3 className="text-base font-medium text-gray-800">{product.tensanpham}</h3>
//                                             <p className="text-sm text-gray-500">{product.color} / {product.size}</p>
//                                         </div>
//                                         <p className="text-base font-semibold text-gray-700">{toVND(product.gia * product.soluong)}</p>
//                                     </div>
//                                 ))
//                             )}
//                         </div>


//                         {/* Voucher Section */}
//                         <div className="mb-6 border-t border-gray-300 pt-6">
//                             <div className="flex justify-between mb-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Nhập mã giảm giá"
//                                     className="flex-grow mr-4 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                                     value={voucherCode}
//                                     onChange={(e) => setVoucherCode(e.target.value)}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={handleApplyVoucher}
//                                     className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-200"
//                                 >
//                                     Áp dụng
//                                 </button>
//                             </div>
//                             {/* Show applied voucher and remove button */}
//                             {discountAmount > 0 && voucherCode && (
//                                 <div className="flex justify-between text-gray-700 mb-2">
//                                     <span className="flex items-center">
//                                         Mã giảm giá đã áp dụng:
//                                         <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center">
//                                             {voucherCode}
//                                             <button
//                                                 onClick={handleRemoveVoucher}
//                                                 className="ml-1 bg-green-300 text-green-700 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-green-400 focus:outline-none"
//                                             >
//                                                 &times;
//                                             </button>
//                                         </span>
//                                     </span>
//                                     <span className="text-red-600 font-semibold">{toVND(discountAmount)}</span>
//                                 </div>
//                             )}

//                             {/* Show available vouchers */}
//                             <div className="grid grid-cols-2 gap-2 text-center text-sm">
//                                 <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">FREESHIPLSFKM</span>
//                                 <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE40KM</span>
//                                 <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE80KM</span>
//                                 <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE120KM</span>
//                             </div>
//                         </div>

//                         {/* Price Summary */}
//                         <div className="space-y-2 border-t border-gray-300 pt-6">
//                             <div className="flex justify-between text-gray-700">
//                                 <span>Tạm tính</span>
//                                 <span>{toVND(subtotal)}</span>
//                             </div>

//                             <div className="flex justify-between text-gray-700">
//                                 <span>Phí vận chuyển</span>
//                                 <span>{shippingFee === 0 ? 'Miễn phí' : toVND(shippingFee)}</span>
//                             </div>
//                             {discountAmount > 0 && (
//                                 <div className="flex justify-between text-gray-700">
//                                     <span>Giảm giá Voucher</span>
//                                     <span className="text-red-600 font-semibold">-{toVND(discountAmount)}</span>
//                                 </div>
//                             )}
//                             <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t border-gray-300 pt-4 mt-4">
//                                 <span>Tổng cộng</span>
//                                 <span>{toVND(total)}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CheckoutPage;



import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toVND from '../utils/helper.js';
import { BsCashCoin } from "react-icons/bs";
import vnpaylogo from '../assets/VNPay-Logo.svg';
import vietnamLocations from '../data/vietnamLocations';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const CUSTOMER_ID = localStorage.getItem("customerId")

    // Dữ liệu giỏ hàng từ state
    const { selectedCartItems, customerId } = location.state || {}; // Lấy từ state

    const [selectedItems, setSelectedItems] = useState(selectedCartItems || []);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const [voucherCode, setVoucherCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(30000);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableWards, setAvailableWards] = useState([]);

    // Effect để kiểm tra xem có sản phẩm trong giỏ không
    useEffect(() => {
        if (!selectedItems || selectedItems.length === 0) {
            navigate('/cart');
            alert('Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng.');
        }
    }, [selectedItems, navigate]);


    // Effect để cập nhật quận/huyện và phường/xã khi chọn tỉnh/thành
    useEffect(() => {
        if (city) {
            const selectedCity = vietnamLocations.find(loc => loc.value === city);
            setAvailableDistricts(selectedCity ? selectedCity.districts : []);
            setDistrict('');
            setWard('');
        }
    }, [city]);

    useEffect(() => {
        if (district) {
            const selectedCity = vietnamLocations.find(loc => loc.value === city);
            if (selectedCity) {
                const selectedDistrict = selectedCity.districts.find(dist => dist.value === district);
                setAvailableWards(selectedDistrict ? selectedDistrict.wards : []);
                setWard('');
            }
        }
    }, [district, city]);

    // Tính toán tổng tiền
    const subtotal = selectedItems.reduce((sum, item) => sum + item.gia * item.soluong, 0);
    const total = subtotal - discountAmount + shippingFee;

    const handleApplyVoucher = () => {
        setError(null);
        let appliedDiscount = 0;
        if (voucherCode === 'T625HE120KM') {
            appliedDiscount = 120000;
        } else if (voucherCode === 'T625HE80KM') {
            appliedDiscount = 80000;
        } else if (voucherCode === 'T625HE40KM') {
            appliedDiscount = 40000;
        } else if (voucherCode === 'FREESHIPLSFKM') {
            setShippingFee(0);
            alert('Voucher FREESHIPLSFKM đã được áp dụng! Phí vận chuyển đã được miễn phí.');
            return;
        } else {
            setError('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
        setDiscountAmount(appliedDiscount);
    };

    const handleRemoveVoucher = () => {
        setVoucherCode('');
        setDiscountAmount(0);
        setShippingFee(30000);
        setError(null);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            setError('Không có sản phẩm nào để đặt hàng.');
            return;
        }

        if (!fullName || !phone || !address || !city || !district || !ward) {
            setError('Vui lòng điền đầy đủ thông tin giao hàng.');
            return;
        }

        setLoading(true);
        setError(null);

        const cityDisplayName = vietnamLocations.find(loc => loc.value === city)?.name || city;
        const districtDisplayName = availableDistricts.find(dist => dist.value === district)?.name || district;
        const wardDisplayName = availableWards.find(w => w.value === ward)?.name || ward;

        const orderData = {
            customerid: CUSTOMER_ID,
            items: selectedItems.map(item => ({
                productid: item.productId,
                quantity: item.soluong,
                price: item.gia,
            })),
            address: `[${address}] ${wardDisplayName} ${districtDisplayName}, ${cityDisplayName}`,
            name: fullName,
            sdt: phone,
            paymentmethod: paymentMethod,
            voucher: voucherCode || null,
        };

        try {
            if (paymentMethod === "VNPAY") {

                const res = await fetch(
                    'http://localhost:4004/v1/api/order/checkout/vnpay',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData),
                    }
                );
                const data = await res.json();
                if (res.ok && data.success && data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                    return;
                } else {
                    throw new Error(data.message || 'Không lấy được paymentUrl từ VNPAY');
                }
            }
            else if (paymentMethod === "COD") {

                const response = await fetch('http://localhost:4004/v1/api/order/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    throw new Error(errorResponse.message || 'Đặt hàng thất bại.');
                }
                const successData = await response.json();
                alert(successData.message + '. Mã đơn hàng của bạn: ' + successData.orderid);
                navigate('/order-confirmation', { state: { orderId: successData.orderid } });
            }


        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            setError(err.message || 'Có lỗi xảy ra khi đặt hàng.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="pt-10 border-t text-center py-20 text-xl font-semibold">Đang xử lý đơn hàng của bạn...</div>;

    console.log('check selectedCartItems: ', selectedCartItems)

    return (
        <div className="pt-10 border-t min-h-screen py-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col-reverse lg:flex-row">
                    {/* Left Section: Shipping Information */}
                    <div className="lg:w-3/5 p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <div className="text-sm text-gray-500 mb-6 flex space-x-2">
                            <Link to="/cart" className="text-blue-600 font-semibold hover:underline">Giỏ hàng</Link>
                            <span className="font-bold">&gt;</span>
                            <span className="text-blue-600 font-semibold">Thanh toán</span>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin giao hàng</h2>

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            {/* Shipping Form Inputs */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Người nhận</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh / Thành</label>
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Chọn tỉnh / thành</option>
                                        {vietnamLocations.map((loc) => (
                                            <option key={loc.value} value={loc.value}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận / Huyện</label>
                                    <select
                                        id="district"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Chọn quận / huyện</option>
                                        {availableDistricts.map((dist) => (
                                            <option key={dist.value} value={dist.value}>{dist.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường / xã</label>
                                    <select
                                        id="ward"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Chọn phường / xã</option>
                                        {availableWards.map((w) => (
                                            <option key={w.value} value={w.value}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mt-8">
                                <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                                <div className="mt-2 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2">Thanh toán khi nhận hàng</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="VNPAY"
                                            checked={paymentMethod === 'VNPAY'}
                                            onChange={() => setPaymentMethod('VNPAY')}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2">Thanh toán qua VNPay</span>
                                        <img src={vnpaylogo} alt="VNPay Logo" className="h-6 w-6 ml-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="mt-8 text-center">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
//                                     className="cursor-pointer w-auto bg-black text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-lg"
//                                     aria-label="Hoàn tất đơn hàng"

                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý đơn hàng...' : 'Hoàn tất đơn hàng'}
                                </button>
                            </div>

                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </form>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:w-2/5 p-8 bg-gray-50 border-b border-gray-200 lg:border-b-0">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng ({selectedItems.length} sản phẩm)</h2>
                        <div className="space-y-6">
                            {selectedItems.map((item) => (
                                <div key={item.productId} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={item.anhsanpham} alt={item.tensanpham} className="w-16 h-16 object-cover rounded-lg mr-4" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-800">{item.tensanpham}</h3>
                                            <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700">{toVND(item.gia * item.soluong)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
