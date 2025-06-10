const supabase = require('../config/supabaseClient');
const Order = require('../models/orderModel')
const Customer = require('../models/customerModel')
const OrderItem = require('../models/orderItem')
const Paymnet = require('../models/paymentModel')
const Shipment = require('../models/shipment')
const Voucher = require('../models/voucherModel')

const checkout = async (req, res) => {
    const { customerid, items, address, paymentmethod, voucher } = req.body;
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

        // const shipment = await Shipment.createShipment(customerid, address);
        // // console.log('check shipment: ', shipment);
        // if (!shipment) {
        //     console.log('Shipment creation failed: No shipment data returned');
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Lỗi ghi xuống Shipment',
        //     });
        // }

        // // tạo hóa đơn
        // const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // const totalDiscount = voucherDetails ? voucherDetails.giatri : 0;
        // const finalAmount = totalAmount - totalDiscount;
        // const orderData = await Order.createOrder(customerid, items.length, totalAmount, finalAmount, voucher, shipment.mashipment);
        // console.log('check result: ', orderData)
        // if (!orderData) {
        //     console.error('Error creating order:'); 
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Lỗi tạo hóa đơn',
        //         error: 'Unknown error',
        //     });
        // }
        // console.log('Order created successfully:', orderData);

        // // tạo chi tiết hóa đơn cho từng sản phẩm trong giỏ hàng
        // const orderItemPromises = items.map((item) => {
        //     return OrderItem.createOrderItem(orderData.mahoadon, item.productid, item.quantity, item.quantity * item.price);
        // });
        // await Promise.all(orderItemPromises);

        // // cập nhật thanh toán
        // const payment = await Paymnet.createPayment(orderData.mahoadon, paymentmethod, orderData.thanhtien)
        // console.log('check payment: ', payment)
        // if (!payment) {
        //     console.log('Payment not found or error')
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Lỗi tạo thanh toán',
        //         error: ""
        //     })
        // }

        // nếu sử dụng voucher -> update lại số lượng trong khachhang_khuyenmai
        const updateQuantity = await Voucher.updateQuantity_CustomerVoucherById(customerid, voucher)
        console.log('check updateQuantity: ', updateQuantity)
        // update giỏ hàng (chưa làm)
        // res.status(200).json({
        //     message: 'Đặt hàng thành công',
        //     orderid: orderData.mahoadon,
        // });
        res.status(200).json({
            message: 'check logic voucher',
            // orderid: orderData.mahoadon,
        });
    } catch (error) {
        console.error('Error during order creation:', error);
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error });
    }
}

module.exports = { checkout }