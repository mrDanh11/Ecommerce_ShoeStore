
const VNPay = require('vnpay');
require('dotenv')

const VNPAY_SECRET = process.env.VNPAY_SECRET
const VNPAY_TMN = process.env.VNPAY_TMN

module.exports = new VNPay({
    tmnCode: VNPAY_TMN,
    secureSecret: VNPAY_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
});
