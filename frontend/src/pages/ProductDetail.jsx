import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart } from 'react-icons/fi';
import { BsLightningCharge } from 'react-icons/bs';
import Loading from "../components/Loading";
import SuccessNotification from "../components/SuccessNotification";

const ProductDetail = () => {
  const navigate = useNavigate()
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [qty, setQty] = useState(1);

  // lấy customerId từ localStorage hoặc Auth Context (tham khảo để lưu + lấy)
  const customerId = localStorage.getItem("customerId")

  useEffect(() => {
    axios
      .get(`http://localhost:4004/api/products/${productId}`)
      .then(({ data }) => {
        if (data.success && data.data.length) {
          setProduct(data.data[0]);
        }
      })
      .catch(console.error);
  }, [productId]);

  // khi có product thì init size/color/detail mặc định
  useEffect(() => {
    if (!product) return;
    const first = product.chitietsanpham[0];
    setSelectedSize(first.size);
    setSelectedColor(first.color);
    setSelectedDetail(first);
  }, [product]);

  // khi change size -> setDetail về variant đầu của size đó
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // filter ra các variant cùng size
    const variants = product.chitietsanpham.filter((d) => d.size === size);
    // pick màu đầu
    const firstOfSize = variants[0];
    setSelectedColor(firstOfSize.color);
    setSelectedDetail(firstOfSize);
    setQty(1);
  };

  // khi change color -> setDetail tương ứng size+color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const detail = product.chitietsanpham.find(
      (d) => d.size === selectedSize && d.color === color
    );
    setSelectedDetail(detail);
    setQty(1);
  };

  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);

  // add to cart function
  const handleAddToCart = async () => {
    if (!selectedDetail)
      return;
    try {
      const body = {
        masanpham: selectedDetail.machitietsanpham,
        soluong: qty
      }
      // alert('Thêm vào giỏ hàng thành công!')
      setMsg('Thêm vào giỏ hàng thành công');
      setShow(true);
      const res = await axios.post(`http://localhost:4004/v1/api/cart/${customerId}`, body)
      if (res.data.success) {
        // thành công
        // alert('Thêm vào giỏ hàng thành công!')
      }
      else {
        alert('Không thể thêm vào giỏ hàng: ' + res.data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Lỗi khi thêm vào giỏ hàng')
    }
  }

  console.log('check selectedDetail: ', selectedDetail)

  // handle checkout -> xử dụng navigate để chuyển trang + truyền props qua navigate
  const handleCheckout = async () => {
    if (!selectedDetail)
      return;

    // const cartItems = [
    //   {
    //     productid: selectedDetail.machitietsanpham,
    //     quantity: qty,
    //     price: selectedDetail.gia
    //   },
    // ]

    const cartItems = [
      {
        anhsanpham: product.anhsanpham,  // Ảnh sản phẩm
        color: selectedDetail.color,  // Màu sắc
        gia: selectedDetail.gia,  // Giá
        productId: selectedDetail.machitietsanpham,
        // productDetailId: selectedDetail.machitietsanpham, 
        size: selectedDetail.size,  // Kích thước
        soluong: qty,  // Số lượng
        tensanpham: product.tensanpham,  // Tên sản phẩm
        description: product.description,  // Mô tả sản phẩm
      }
    ];

    console.log("check data đã gửi sang trang checkout:", cartItems);

    navigate("/checkout", {
      state: {
        customerId,
        selectedCartItems: cartItems
      }
    })

    console.log('check data đã gửi sang trang checkout: ', customerId, cartItems)
  }

  if (!product || !selectedDetail)
    return <Loading />

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* image */}
      <div>
        <img
          src={product.anhsanpham}
          alt={product.tensanpham}
          className="w-full rounded-lg object-cover"
        />
      </div>

      {/* info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900">
          {product.tensanpham}
        </h1>
        <p className="text-gray-600">{product.description}</p>

        {/* price */}
        <div className="flex items-baseline space-x-4">
          <span className="text-2xl font-bold text-gray-900">
            {selectedDetail.gia.toLocaleString()}₫
          </span>
          {product.gia !== selectedDetail.gia && (
            <span className="text-gray-500 line-through">
              {product.gia.toLocaleString()}₫
            </span>
          )}
        </div>

        {/* status */}
        <span
          className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${product.tinhtrang === "Còn hàng"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {product.tinhtrang}
        </span>

        {/* category */}
        <p className="text-sm text-gray-500">
          Category: {product.danhmucsanpham.tendanhmuc}
        </p>

        {/* size dropdown */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full cursor-pointer border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[...new Set(product.chitietsanpham.map((d) => d.size))].map(
              (size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              )
            )}
          </select>
        </div>

        {/* color dropdown */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Color</label>
          <select
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full border cursor-pointer border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {product.chitietsanpham
              .filter((d) => d.size === selectedSize)
              .map((d) => d.color)
              .filter((c, i, arr) => arr.indexOf(c) === i)
              .map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
          </select>
        </div>

        {/* quantity */}
        <div className="flex items-center space-x-4">
          <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 cursor-pointer hover:bg-gray-100 focus:outline-none"
            >
              –
            </button>
            <span className="px-4 text-gray-800">{qty}</span>
            <button
              onClick={() =>
                setQty((q) => Math.min(selectedDetail.soluong, q + 1))
              }
              className="px-3 py-1 cursor-pointer hover:bg-gray-100 focus:outline-none"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {selectedDetail.soluong} available
          </span>
        </div>

        {/* two buttons on one row with icons */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 cursor-pointer flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md transition"
          >
            {show && (
              <SuccessNotification
                message={msg}
                duration={3000}
                onClose={() => setShow(false)}
              />
            )}
            <FiShoppingCart className="mr-2 w-5 h-5" />
            Add to Cart
          </button>
          <button
            onClick={handleCheckout}
            className="flex-1 cursor-pointer flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition"
          >
            <BsLightningCharge className="mr-2 w-5 h-5" />
            Đặt Hàng Ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
