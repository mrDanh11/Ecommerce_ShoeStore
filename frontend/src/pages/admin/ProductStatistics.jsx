import { useState } from "react";

const ProductStatistics = () => {
  const [products] = useState([
    { id: 1, name: "Giày ALP2401", price: 1200000, category: "Giày thể thao", quantity: 10 },
    { id: 2, name: "Giày AV00205", price: 1450000, category: "Giày thể thao", quantity: 5 },
    { id: 3, name: "Giày AV00214", price: 1350000, category: "Giày công sở", quantity: 8 },
    { id: 4, name: "Giày Sneaker Cam", price: 1350000, category: "Giày thể thao", quantity: 12 }
  ]);

  // Tính toán thống kê
  const totalProducts = products.length;
  const totalRevenue = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = 0;
    }
    acc[product.category] += product.quantity;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Thống kê sản phẩm</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tổng số sản phẩm</h2>
          <p className="text-2xl">{totalProducts}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Tổng doanh thu</h2>
          <p className="text-2xl">{totalRevenue.toLocaleString()} VND</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Sản phẩm theo loại</h2>
          <ul>
            {Object.keys(productsByCategory).map((category) => (
              <li key={category} className="text-xl">
                {category}: {productsByCategory[category]} sản phẩm
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductStatistics;