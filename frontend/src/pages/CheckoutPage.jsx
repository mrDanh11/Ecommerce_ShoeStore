import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toVND from '../utils/helper.js'
import { BsCashCoin } from "react-icons/bs";
import img1 from '../assets/Pro_ALP2401_1.jpg'
import img2 from '../assets/Pro_AV00214_1.jpg'
import vnpaylogo from '../assets/VNPay-Logo.svg'


const CheckoutPage = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const [voucherCode, setVoucherCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);

    const [shippingFee, setShippingFee] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleApplyVoucher = () => {
        console.log('Applying voucher:', voucherCode);

        // --- DEMO ---
        let appliedDiscount = 0;
        if (voucherCode === 'T625HE120KM') {
            appliedDiscount = 120000;
        } else if (voucherCode === 'T625HE80KM') {
            appliedDiscount = 80000;
        } else if (voucherCode === 'T625HE40KM') {
            appliedDiscount = 40000;
        } else if (voucherCode === 'FREESHIPLSFKM') {
            appliedDiscount = 20000;
        }

        setDiscountAmount(appliedDiscount);
    };

    const handleRemoveVoucher = () => {
        setVoucherCode('');
        setDiscountAmount(0);
    };

    const handlePlaceOrder = () => {
        console.log('Placing order with details:', {
            fullName,
            phone,
            address,
            city,
            district,
            ward,
            note,
            items: products,
            subtotal,
            discountAmount,
            shippingFee,
            paymentMethod,
            total,
        });
        // Redirect to a success page or show a confirmation
        alert('Đơn hàng của bạn đã được đặt thành công!');
    };


    const products = [
        {
            id: 1,
            tensanpham: 'Dép Sandal Eva Biti\'s Trẻ Em Màu Kem',
            size: '25',
            color: 'Trắng',
            gia: 506000,
            soluong: 2,
            anhsanpham: img1,
        },
        {
            id: 2,
            tensanpham: 'Giày Thể Thao Biti\'s Hunter Layered Upper Nam Màu Trắng',
            size: '40',
            color: 'Đen',
            gia: 660000,
            soluong: 1,
            anhsanpham: img2,
        },
    ];

    const subtotal = products.reduce((sum, item) => sum + item.gia * item.soluong, 0);
    const total = subtotal - discountAmount + shippingFee;

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col-reverse lg:flex-row">
                    {/* Left Section: Shipping Information */}
                    <div className="lg:w-3/5 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <div className="text-sm text-gray-500 mb-6 flex space-x-2">
                            <span className="text-blue-600 font-semibold">Giỏ hàng</span>
                            <span className="font-bold">&gt;</span>
                            <span className="text-blue-600 font-semibold">Thanh toán</span>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin giao hàng</h2>

                        {/* Shipping Address Form */}
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    placeholder="Số điện thoại"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Người nhận</label>
                                <input
                                    type="text"
                                    id="Họ và tên"
                                    placeholder="Họ và tên"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="Địa chỉ"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            {/* Tỉnh Thành, Quận Huyện, Phường Xã Dropdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh / thành</label>
                                    <select
                                        id="city"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    >
                                        <option value="">Chọn tỉnh / thành</option>
                                        <option value="HCM">TP. Hồ Chí Minh</option>
                                        <option value="Hanoi">Hà Nội</option>
                                        {/* Thêm các tỉnh thành khác */}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">Quận / huyện</label>
                                    <select
                                        id="district"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                    >
                                        <option value="">Chọn quận / huyện</option>
                                        {/* Thêm các quận huyện tương ứng */}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Phường / xã</label>
                                    <select
                                        id="ward"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                    >
                                        <option value="">Chọn phường / xã</option>
                                        {/* Thêm các phường xã tương ứng */}
                                    </select>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 mt-8">Phương thức thanh toán</h2>
                            <div className="space-y-4">
                                {/* COD Option */}
                                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-gray-800 font-medium">Thanh toán khi nhận hàng (COD)</span>
                                    <span className="ml-auto text-gray-500 text-sm">
                                        <BsCashCoin className="h-5 w-5 inline-block mr-2.5" />
                                    </span>
                                </label>

                                {/* VNPay Option */}
                                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="vnpay"
                                        checked={paymentMethod === 'vnpay'}
                                        onChange={() => setPaymentMethod('vnpay')}
                                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-3 text-gray-800 font-medium">Thanh toán qua VNPay</span>
                                    <span className="ml-auto w-20 h-8 flex items-center justify-end overflow-hidden">
                                        <img src={vnpaylogo} alt="VNPay Logo" className="w-1/2 h-full object-contain" />
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between mt-10">
                                <Link to="/cart" className="block text-center text-base font-medium text-black hover:underline">
                                    Quay về giỏ hàng
                                </Link>
                                <button
                                    type="button"
                                    onClick={handlePlaceOrder}
                                    className="cursor-pointer w-auto bg-black text-white p-4 rounded-lg font-semibold hover:bg-gray-800 transition transform hover:scale-105 shadow-lg"
                                    aria-label="Hoàn tất đơn hàng"
                                >
                                    Hoàn tất đơn hàng
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:w-2/5 p-8 bg-gray-50 border-b border-gray-200 lg:border-b-0">
                        {/* Product List */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Đơn hàng ({products.length} sản phẩm)</h2>
                        <div className="space-y-6 mb-6 border-t border-gray-300 pt-6">
                            {products.map((product) => (
                                <div key={product.productId} className="flex items-center">
                                    <div className="relative mr-4 flex-shrink-0">
                                        <img src={product.anhsanpham} alt={product.tensanpham} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                        <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {product.soluong}
                                        </span>
                                    </div>
                                    <div className="flex-grow"> 
                                        <h3 className="text-base font-medium text-gray-800">{product.tensanpham}</h3>
                                        <p className="text-sm text-gray-500">{product.color} / {product.size}</p>
                                    </div>
                                    <p className="text-base font-semibold text-gray-700">{toVND(product.gia * product.soluong)}</p>
                                </div>
                            ))}
                        </div>


                        {/* Voucher Section */}
                        <div className="mb-6 border-t border-gray-300 pt-6">
                            <div className="flex justify-between mb-4">
                                <input
                                    type="text"
                                    placeholder="Nhập mã giảm giá"
                                    className="flex-grow mr-4 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyVoucher}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200"
                                >
                                    Áp dụng
                                </button>
                            </div>
                            {/* Show available vouchers */}
                            <div className="grid grid-cols-2 gap-2 text-center text-sm">
                                <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">FREESHIPLSFKM</span>
                                <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE40KM</span>
                                <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE80KM</span>
                                <span className="bg-red-100 text-red-700 py-2 px-3 rounded-md border border-red-300">T625HE120KM</span>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="space-y-2 border-t border-gray-300 pt-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Tạm tính</span>
                                <span>{toVND(subtotal)}</span>
                            </div>

                            {/* Conditionally render the discount line */}
                            {discountAmount > 0 && voucherCode && (
                                <div className="flex justify-between text-gray-700">
                                    <span className="flex items-center">
                                        Mã giảm giá
                                        <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded flex items-center">
                                            {voucherCode}
                                            
                                        </span>
                                        <button
                                            onClick={handleRemoveVoucher}
                                            className="ml-1 bg-gray-300 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-gray-400 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                    <span className="text-red-600 font-semibold">{toVND(discountAmount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-gray-700">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee === 0 ? '-' : toVND(shippingFee)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t border-gray-300 pt-4 mt-4">
                                <span>Tổng cộng</span>
                                <span>{toVND(total)}</span>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;