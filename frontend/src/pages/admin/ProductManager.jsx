import { useState, useEffect } from "react";
import axios from "axios";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    axios
      .get("http://localhost:4004/api/products") // Đảm bảo đây là đường dẫn API chính xác
      .then((response) => {
        console.log("Dữ liệu sản phẩm nhận được:", response.data);
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Giả sử API trả về mảng sản phẩm
        } else {
          setError("Dữ liệu sản phẩm không hợp lệ");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải sản phẩm");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>

      {/* Thông báo lỗi */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Bảng danh sách sản phẩm */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Tên sản phẩm</th>
              <th className="p-2 border">Giá</th>
              <th className="p-2 border">Số lượng</th>
              <th className="p-2 border">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.price} VND</td>
                  <td className="p-2 border">{product.quantity}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => alert(`Sửa sản phẩm: ${product.name}`)}
                      className="bg-yellow-500 text-white p-1"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => alert(`Xoá sản phẩm: ${product.name}`)}
                      className="bg-red-500 text-white p-1 ml-2"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">Không có sản phẩm</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManager;
