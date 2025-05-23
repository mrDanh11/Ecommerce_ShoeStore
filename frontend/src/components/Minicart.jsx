import imgTorpedo from '../assets/Pro_ALP2401_1.jpg';
import imgToro from '../assets/Pro_AV00205_1.jpeg';
import imgRobusto from '../assets/Pro_AV00214_1.jpg';
import { TiDelete } from "react-icons/ti";

const Minicart = () => {
  const cartItems = [
    {
      productId: 1,
      img: imgTorpedo,
      name: 'TORPEDO',
      color: 'Trắng',
      qty: 1,
      size: 8,
      price: 260000      
    },
    {
      productId: 2,
      img: imgToro,
      name: 'TORO',
      color: 'Xám',
      qty: 1,
      size: 9,
      price: 270000    
    },
    {
      productId: 3,
      img: imgRobusto,
      name: 'ROBUSTO',
      color: 'Đen',
      qty: 2,
      size: 10,
      price: 320000      
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal * 0.2

  const toVND = (value) => {
    value = value.toString().replace(/\./g, "");
    const formatted = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
      })
      .format(value)
      .replace("₫", "")
      .trim();
    
    return formatted;
  }
    
  return (
    <div className="absolute -right-5 top-5 w-104 bg-white rounded-xl shadow-lg z-50 p-5">
      {/* Items */}
      <div className="space-y-4">
        {
          cartItems.map((product, index) => (
            <div key={index} className="flex items-center space-x-3">
              <button className="text-gray-500 text-xl hover:text-gray-700 z-10 cursor-pointer">
                <TiDelete className="h-7 w-7"/>
              </button>
              <img src={product.img} alt={product.name} className="w-26 h-full object-cover rounded" />
              <div className="flex-1 ml-2">
                <h4 className="font-semibold text-gray-700">{product.name}</h4>
                <p className="text-xs text-gray-600">Màu: {product.color}<br/>Size: US {product.size}</p>
                <div className="flex justify-center items-center rounded mt-2 w-fit">
                  <button className="px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer">−</button>
                  <span className="px-4 text-gray-800">{product.qty}</span>
                  <button className="px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer">+</button>
                </div>
              </div>
              <div className="text-sm text-gray-800 font-bold self-start">{toVND(product.price)}</div>
            </div>
          ))
        }
      </div>

      {/* Subtotal */}
      <div className="border-t mt-4 pt-4 text-sm text-gray-800 font-bold">
        <div className="flex justify-between">
          <span>Tổng số tiền</span>
          <span className="font-bold">{toVND(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span className="text-green-600">{toVND(shipping)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer">
          XEM GIỎ HÀNG
        </button>
        <button className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg text-sm font-semibold cursor-pointer">
          THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Minicart;