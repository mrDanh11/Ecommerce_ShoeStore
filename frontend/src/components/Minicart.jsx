import imgTorpedo from '../assets/Pro_ALP2401_1.jpg'
import imgToro from '../assets/Pro_AV00205_1.jpeg'
import imgRobusto from '../assets/Pro_AV00214_1.jpg'
import { IoMdClose } from "react-icons/io"


const Minicart = ({ minicartOpen, toggleMinicart }) => {
  const cartItems = [
    {
      productId: 1,
      img: imgTorpedo,
      name: 'Urbas Love+ 24 - Oyster White',
      color: 'Trắng',
      qty: 1,
      size: 8,
      price: 260000      
    },
    {
      productId: 2,
      img: imgToro,
      name: 'Vintas Vivu - Low Top - Warm Sand',
      color: 'Xám',
      qty: 1,
      size: 9,
      price: 270000    
    },
    {
      productId: 3,
      img: imgRobusto,
      name: 'Track 6 Fold-over Tongue - The Team - Low Top - Caviar Black',
      color: 'Đen',
      qty: 2,
      size: 10,
      price: 320000      
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  const toVND = (value) => {
    value = value.toString().replace(/\./g, "");
    const formatted = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
      })
      .format(value)
      .replace("₫", "")
      .trim();
    
    return formatted
  }
    
  return (
    <div className={`fixed top-0 right-0 w-6/7 sm:w-3/5 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
      minicartOpen ? "translate-x-0" : "translate-x-full"
    }`}>

      {/* Close Button */}
      <div className="flex justify-end pt-4 pr-4">
        <button className="cursor-pointer" onClick={toggleMinicart}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart contents with scrollable area */}
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="border-b border-gray-400">
          <h2 className="text-center text-xl font-semibold mb-4 uppercase">Giỏ hàng</h2>
        </div>
        <div>
          {
            cartItems.map((product, index) => (
              <div key={index} className="flex justify-between py-4 border-b border-dotted border-gray-400">
                <div className="flex items-start w-full">
                  <img src={product.img} alt={product.name} className="w-20 h-24 object-cover mr-4 rounded" />
                  <div className="flex flex-col justify-between h-full w-full">
                    <div>
                      <h3 className="block text-sm font-semibold text-gray-700">
                      {product.name}
                      </h3>
                      <p className="block text-xs text-gray-600">
                        {product.color} / {product.size} 
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center mt-2">
                        <button className="border rounded px-2 py-0.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer">
                          −
                        </button>
                        <span className="mx-3 text-sm text-gray-800">{product.qty}</span>
                        <button className="border rounded px-2 py-0.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer">
                          +
                        </button>
                      </div>
                      <p className="self-end text-sm font-medium text-gray-800 mb-1">{toVND(product.price)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Subtotal and Navigate To Cart Page Button at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        {/* Subtotal */}
        <div className="mb-4 text-sm text-gray-800 font-bold">
          <div className="flex justify-between">
            <span>TỔNG TIỀN:</span>
            <span className="font-bold text-red-500">{toVND(subtotal)}</span>
          </div>
        </div>
        <button className="cursor-pointer w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
          XEM GIỎ HÀNG
        </button>
      </div>
    </div>
  )
}

export default Minicart
