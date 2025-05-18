import imgTorpedo from '../assets/Pro_ALP2401_1.jpg';
import imgToro from '../assets/Pro_AV00205_1.jpeg';
import imgRobusto from '../assets/Pro_AV00214_1.jpg';
import { FiTrash2 } from "react-icons/fi";
import { useState } from 'react';

const Minicart = () => {
  const cartItems = [
    {
      productId: 1,
      img: imgTorpedo,
      name: 'TORPEDO',
      color: 'Trắng',
      qty: 1,
      size: 8,
      price: 42      
    },
    {
      productId: 2,
      img: imgToro,
      name: 'TORO',
      color: 'Xám',
      qty: 1,
      size: 9,
      price: 42      
    },
    {
      productId: 3,
      img: imgRobusto,
      name: 'ROBUSTO',
      color: 'Đen',
      qty: 2,
      size: 10,
      price: 72      
    }
  ]
    
  return (
    <div className="absolute -right-5 top-5 w-96 bg-white rounded-xl shadow-lg z-50 p-6">
      {/* Items */}
      <div className="space-y-4">
        {
          cartItems.map((product, index) => (
            <div key={index} className="flex items-start space-x-4">
              <img src={product.img} alt={product.name} className="w-22 h-22 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-700">{product.name}</h4>
                <p className="text-xs text-gray-600">Màu: {product.color}<br/>Size: US {product.size}</p>
                <div className="flex justify-center items-center rounded mt-3 w-fit">
                  <button className="px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200">−</button>
                  <span className="px-4 text-gray-800">{product.qty}</span>
                  <button className="px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200">+</button>
                </div>
              </div>
              <div className="text-sm text-gray-800 font-bold">${product.price}</div>
            </div>
          ))
        }
      </div>

      {/* Subtotal */}
      <div className="border-t mt-4 pt-4 text-sm text-gray-800 font-bold">
        <div className="flex justify-between">
          <span>Tổng số tiền</span>
          <span className="font-semibold">${cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span className="text-green-600">FREE</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">
          XEM GIỎ HÀNG
        </button>
        <button className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg text-sm font-semibold">
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Minicart;