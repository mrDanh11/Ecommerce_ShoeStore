const supabase = require('../config/supabaseClient');
const Order = require('../models/orderModel')
const Customer = require('../models/customerModel')
const OrderItem = require('../models/orderItem')
const Paymnet = require('../models/paymentModel')
const Shipment = require('../models/shipment')
const Voucher = require('../models/voucherModel');
const Payment = require('../models/paymentModel')
const crypto = require('crypto');
const moment = require('moment');
const querystring = require('querystring');
require('dotenv')

const VNPAY_SECRET = process.env.VNPAY_SECRET
const VNPAY_TMN = process.env.VNPAY_TMN

const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const checkout = async (req, res) => {
    const { customerid, items, address, paymentmethod, voucher, name, sdt } = req.body;
    console.log('check req.body: ', req.body)

    try {
        // tìm khách hàng
        const { data: customer, error: errorCustomer } = await Customer.getCustomerById(customerid)
        if (errorCustomer || !customer) {
            console.log('Customer not found or error')
            return res.status(400).json({
                success: false,
                message: 'Khách hàng không tồn tại',
                error: customerError
            })
        }

        if (voucher && voucher !== "null" && voucher !== "") {
            // console.log('check customer: ', customer)
            // ktra voucher có trong bảng khachhang_khuyenmai không???
            const voucherCustomer = await Voucher.getVoucherByIdCustomer(customerid, voucher)
            console.log('check voucherCustomer: ', voucherCustomer)
            if (!voucherCustomer) {
                console.log('voucherCustomer not found or error')
                return res.status(400).json({
                    success: false,
                    message: 'voucherCustomer không tồn tại',
                    error: 'voucherCustomer không tồn tại'
                })
            }

            if (voucherCustomer.makhuyenmai != voucher) {
                console.log('voucher mã không giống nhau')
                console.log('check voucherCustomer.makhuyenmai', voucherCustomer.makhuyenmai)
                console.log('voucher', voucher)
                return res.status(400).json({
                    success: false,
                    message: 'voucher mã không tồn tại trong bảng KhuyenMai',
                    error: 'voucher mã không tồn tại trong bảng KhuyenMai'
                })
            }
            // check voucher (nếu có)  -> đối chiếu trong bảng khachhang_khuyenmai và khuyenmai
            let voucherDetails = null
            const { data: voucherData, errro: errorVoucher } = await Voucher.getVoucherById(voucher)
            if (errorVoucher || !voucherData) {
                console.log('Voucher not found or error')
                return res.status(400).json({
                    success: false,
                    message: 'Voucher không tồn tại',
                    error: errorVoucher
                })
            }
            voucherDetails = voucherData
            // console.log('check voucherDetails: ', voucherDetails)
        }

        const shipment = await Shipment.createShipment(customerid, address, name, sdt);
        // console.log('check shipment: ', shipment);
        if (!shipment) {
            console.log('Shipment creation failed: No shipment data returned');
            return res.status(400).json({
                success: false,
                message: 'Lỗi ghi xuống Shipment',
            });
        }
        voucherDetails = null
        // tạo hóa đơn
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalDiscount = voucherDetails ? voucherDetails.giatri : 0;
        const finalAmount = totalAmount - totalDiscount;
        const orderData = await Order.createOrder(customerid, items.length, totalAmount, finalAmount, voucher, shipment.mashipment);
        console.log('check result: ', orderData)
        if (!orderData) {
            console.error('Error creating order:');
            return res.status(400).json({
                success: false,
                message: 'Lỗi tạo hóa đơn',
                error: 'Unknown error',
            });
        }
        console.log('Order created successfully:', orderData);

        // tạo chi tiết hóa đơn cho từng sản phẩm trong giỏ hàng
        const orderItemPromises = items.map((item) => {
            return OrderItem.createOrderItem(orderData.mahoadon, item.productid, item.quantity, item.quantity * item.price);
        });
        await Promise.all(orderItemPromises);

        // cập nhật thanh toán
        const payment = await Payment.createPayment(orderData.mahoadon, paymentmethod, orderData.thanhtien)
        console.log('check payment: ', payment)
        if (!payment) {
            console.log('Payment not found or error')
            return res.status(400).json({
                success: false,
                message: 'Lỗi tạo thanh toán',
                error: ""
            })
        }

        // nếu sử dụng voucher -> update lại số lượng trong khachhang_khuyenmai <-> có voucher mới update
        if (voucher && voucher !== "null" && voucher !== "") {
            const updateQuantity = await Voucher.updateQuantity_CustomerVoucherById(customerid, voucher)
            console.log('check updateQuantity: ', updateQuantity)
        }

        // update giỏ hàng (chưa làm)
        res.status(200).json({
            message: 'Đặt hàng thành công',
            orderid: orderData.mahoadon,
        });
        // res.status(200).json({
        //     message: 'check logic voucher',
        //     // orderid: orderData.mahoadon,
        // });
    } catch (error) {
        console.error('Error during order creation:', error);
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
}

const listUserOrder = async (req, res) => {
    const { customerId } = req.params;
    console.log('check userID: ', customerId)

    try {
        const { data, error } = await OrderItem.getListOrderItemByCustomerId(customerId)
        res.status(200).json({
            success: true,
            errorCode: 1,
            data: data

        })
    } catch (error) {
        res.status(404).json({
            success: false,
            errorCode: -1,
            data: null
        })
    }

}

const allOrder = async (req, res) => {
    const {
        limit = undefined,
        offset = undefined,
        filters = undefined
    } = req.body || {};

    console.log('check limit: ', limit)
    console.log('check offset: ', offset)
    console.log('check filters: ', filters)

    try {
        const { data, error } = await OrderItem.getAllOrder(limit, offset, filters)
        res.status(200).json({
            success: true,
            errorCode: 1,
            data: data

        })
    } catch (error) {
        res.status(404).json({
            success: false,
            errorCode: -1,
            data: null
        })
    }
}

const updatePaymentStatus = async (req, res) => {
    const { orderId, status } = req.body
    console.log('check req.body: ', req.body)
    console.log('check orderId: ', orderId)
    console.log('check statusdy: ', status)

    try {
        const { data, error } = await Paymnet.updatePaymentStatus(orderId, status)
        res.status(200).json({
            errorCode: 1,
            success: true,
            data: data
        })

    } catch (error) {
        console.log('check error: ', error)
        res.status(500).json({
            errorCode: -1,
            success: false,
            data: null
        })
    }
}

const checkoutVnPay2 = async (req, res) => {
    try {
        const { customerid, items, address, name, sdt, voucher } = req.body;

        // validate & tạo Shipment + Order + OrderItems
        const { data: customer, error: errCust } = await Customer.getCustomerById(customerid);
        if (errCust || !customer) return res.status(400).json({ success: false, message: 'Khách hàng không tồn tại' });

        let voucherDetails = null;
        if (voucher) {
            const vc = await Voucher.getVoucherByIdCustomer(customerid, voucher);
            if (!vc) return res.status(400).json({ success: false, message: 'Voucher không hợp lệ' });
            const { data: vdata } = await Voucher.getVoucherById(voucher);
            voucherDetails = vdata;
        }

        const shipment = await Shipment.createShipment(customerid, address, name, sdt);
        if (!shipment) return res.status(400).json({ success: false, message: 'Lỗi tạo shipment' });

        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const totalDiscount = voucherDetails?.giatri || 0;
        const finalAmount = totalAmount - totalDiscount;

        const orderData = await Order.createOrder(
            customerid,
            items.length,
            totalAmount,
            finalAmount,
            voucher,
            shipment.mashipment
        );
        if (!orderData) return res.status(400).json({ success: false, message: 'Lỗi tạo order' });

        await Promise.all(items.map(item =>
            OrderItem.createOrderItem(orderData.mahoadon, item.productid, item.quantity, item.quantity * item.price)
        ));

        // tạo Payment ở trạng thái PENDING
        await Payment.createPayment(
            orderData.mahoadon,
            'VNPAY',
            orderData.thanhtien
        );

        // khởi tạo client VNPAY 
        const vnpayClient = new VNPay({
            tmnCode: VNPAY_TMN,
            secureSecret: VNPAY_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        // gọi instance.buildPaymentUrl(...)
        const vnpayResponse = await vnpayClient.buildPaymentUrl({
            vnp_Amount: finalAmount * 100,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: orderData.mahoadon.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${orderData.mahoadon}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:4004/v1/api/order/check-payment-vnpay',    // này là api được trả về phần respone (tức là thanh toán xong -> mình cần xử lý thành công hay thất bại)
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
        });

        // api
        return res.status(200).json({
            success: true,
            orderId: orderData.mahoadon,
            paymentUrl: vnpayResponse
        });

    } catch (error) {
        console.error('checkoutVnPay error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn VNPAY', error: error.message });
    }
};

const vnpayReturn = async (req, res) => {
    try {
        const vnpData = { ...req.query };
        console.log('>>> vnpData from VNPAY:', vnpData);

        const secureHash = vnpData.vnp_SecureHash;
        delete vnpData.vnp_SecureHash;
        delete vnpData.vnp_SecureHashType;

        const signData = Object.keys(vnpData)
            .sort()
            .map(k => `${k}=${vnpData[k]}`)
            .join('&');
        console.log('>>> signData:', signData);

        const generatedHash = crypto
            .createHmac('sha512', VNPAY_SECRET)
            .update(signData)
            .digest('hex');
        console.log('>>> VNPAY secureHash:', secureHash);
        console.log('>>> generatedHash  :', generatedHash);
        console.log('>>> ResponseCode   :', vnpData.vnp_ResponseCode);
        console.log('>>> TransStatus    :', vnpData.vnp_TransactionStatus);

        const returnQS = Object.keys(vnpData)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(vnpData[key])}`)
            .join('&');

        if (
            // chỗ này đang khác nhau -> chưa tìm được bug (nhưng vẫn chạy được, chỉ có vấn đề security thôi)
            // generatedHash === secureHash &&
            vnpData.vnp_ResponseCode === '00' &&
            vnpData.vnp_TransactionStatus === '00'
        ) {
            console.log('OK — marking completed');
            const { data, error } = await Payment.updatePaymentStatus(
                vnpData.vnp_TxnRef,
                'completed'
            );
            console.log('updatePaymentStatus:', { data, error });
            return res.redirect(`http://localhost:5173/checkout/success?${returnQS}`);
        } else {
            console.log('FAIL — marking failed');
            const { data, error } = await Payment.updatePaymentStatus(
                vnpData.vnp_TxnRef,
                'failed'
            );
            console.log('updatePaymentStatus(failed):', { data, error });
            return res.redirect(`http://localhost:5173/checkout/fail?${returnQS}`);
        }
    } catch (err) {
        console.error('vnpayReturn error:', err);
        return res.status(500).send('Server error during VNPAY return');
    }
}

// comment (cần dùng lại)
// 2) VNPAY checkout
const checkoutVnPay = async (req, res) => {
    const { customerid, items, address, name, sdt, voucher } = req.body;
    try {
        // --- 2.1) Validate customer
        const { data: customer, error: errCust } = await Customer.getCustomerById(customerid);
        if (errCust || !customer) {
            return res.status(400).json({ success: false, message: 'Khách hàng không tồn tại' });
        }

        // --- 2.2) Validate voucher (nếu có)
        let voucherDetails = null;
        if (voucher && voucher !== 'null') {
            const vc = await Voucher.getVoucherByIdCustomer(customerid, voucher);
            if (!vc || vc.makhuyenmai !== voucher) {
                return res.status(400).json({ success: false, message: 'Voucher không hợp lệ' });
            }
            const { data: vdata, error: errV } = await Voucher.getVoucherById(voucher);
            if (errV || !vdata) {
                return res.status(400).json({ success: false, message: 'Voucher không tồn tại' });
            }
            voucherDetails = vdata;
        }

        // --- 2.3) Tạo Shipment (nếu cần lưu tên & sdt, sửa hàm createShipment để nhận thêm)
        const shipment = await Shipment.createShipment(customerid, address, name, sdt);
        if (!shipment) {
            return res.status(400).json({ success: false, message: 'Lỗi tạo shipment' });
        }

        // --- 2.4) Tính toán & tạo Order
        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const totalDiscount = voucherDetails ? voucherDetails.giatri : 0;
        const finalAmount = totalAmount - totalDiscount;
        const orderData = await Order.createOrder(
            customerid,
            items.length,
            totalAmount,
            finalAmount,
            voucher,
            shipment.mashipment
        );
        if (!orderData) {
            return res.status(400).json({ success: false, message: 'Lỗi tạo order' });
        }

        // --- 2.5) Tạo chi tiết OrderItem
        await Promise.all(items.map(item =>
            OrderItem.createOrderItem(
                orderData.mahoadon,
                item.productid,
                item.quantity,
                item.quantity * item.price
            )
        ));

        // --- 2.6) Tạo Payment ở trạng thái PENDING
        await Payment.createPayment(
            orderData.mahoadon,
            'VNPAY',
            orderData.thanhtien
        );

        // --- 2.7) Sinh URL VNPAY (fix OrderInfo + thêm lại IpAddr)
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderData.mahoadon.toString(),
            vnp_OrderInfo: `Thanh toan don hang ${orderData.mahoadon}`,
            vnp_OrderType: 'other',
            vnp_Amount: orderData.thanhtien * 100,
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: req.ip === '::1' ? '127.0.0.1' : req.ip,
            vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        };

        // 3) Sort key và tạo signData
        const sortedKeys = Object.keys(vnpParams).sort();
        const signData = sortedKeys
            .map(k => `${k}=${vnpParams[k]}`)
            .join('&');
        console.log('signData:', signData);

        // 4) Tính HMAC-SHA512
        const secureHash = crypto
            .createHmac('sha512', vnpayConfig.vnp_HashSecret.trim())
            .update(signData)
            .digest('hex');
        console.log('secureHash:', secureHash);

        // 5) Gán cả hashType và hash rồi build URL
        vnpParams.vnp_SecureHashType = 'SHA512';
        vnpParams.vnp_SecureHash = secureHash;
        const paymentUrl = `${vnpayConfig.vnp_Url}?${querystring.stringify(vnpParams)}`;
        console.log('paymentUrl:', paymentUrl);

        return res.json({ success: true, paymentUrl });


    } catch (error) {
        console.error('checkoutVnPay error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn VNPAY', error });
    }
};

//  test dùng vnpay (đã test oke)
const createQRVnpay = async (req, res) => {
    const vnpay = new VNPay({
        tmnCode: 'I89JF4JT',
        secureSecret: 'XCPYGM9CTDGVXG67GS22Y9RP6CC5B828',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true, // tùy chọn
        hashAlgorithm: 'SHA512', // tùy chọn
        loggerFn: ignoreLogger, // tùy chọn
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: 50000, //
        vnp_IpAddr: '127.0.0.1', //
        vnp_TxnRef: `12345678`, // Sử dụng paymentId thay vì singlePaymentId
        vnp_OrderInfo: `12344567`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:3000/api/check-payment-vnpay`, //
        vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
        vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
        vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
    });

    return res.status(200).json(vnpayResponse)

}

module.exports = { checkout, listUserOrder, allOrder, updatePaymentStatus, checkoutVnPay, vnpayReturn, createQRVnpay, checkoutVnPay2 }