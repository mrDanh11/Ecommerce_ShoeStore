// pages/shop/Success.jsx
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Success = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [info, setInfo] = useState({
    code: null,
    txnRef: '',
    amount: '',
    orderInfo: '',
  })

  useEffect(() => {
    const code = searchParams.get('vnp_ResponseCode')
    const txnRef = searchParams.get('vnp_TxnRef')
    const amount = searchParams.get('vnp_Amount')
    const orderInfo = searchParams.get('vnp_OrderInfo')

    setInfo({ code, txnRef, amount, orderInfo })

    // Nếu thanh toán không thành công thì redirect về fail
    if (code && code !== '00') {
      navigate('/checkout/fail')
    }
  }, [searchParams, navigate])

  // Chưa có params thì show loading
  if (info.code === null) {
    return <div className="py-16 text-center">Đang xử lý kết quả thanh toán...</div>
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 border border-green-500 rounded-lg text-center">
      <h1 className="text-3xl font-semibold text-green-600 mb-4">🎉 Thanh toán thành công!</h1>
      <p className="mb-2"><strong>Số tiền:</strong> {info.amount?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ₫</p>
      <p className="mb-2"><strong>Đơn hàng:</strong> {info.orderInfo}</p>
      <p className="mb-4"><strong>Mã giao dịch VNPAY:</strong> {info.txnRef}</p>
      <button
        onClick={() => navigate('/orders')}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Xem đơn hàng của tôi
      </button>
    </div>
  )
}

export default Success
