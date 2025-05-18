import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('sanpham')
        .select('*');  

      if (error) {
        setError(error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  console.log("check product: ", products);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product.masanpham} style={{ marginBottom: 20 }}>
            <h3>{product.tensanpham}</h3>
            <img
              src={product.anhsanpham}
              alt={product.tensanpham}
              style={{ width: 200, height: 'auto', objectFit: 'contain' }}
            />
            <p>Giá: {product.gia?.toLocaleString()} VNĐ</p>
            <p>Mô tả: {product.description}</p>
            <p>Tình trạng: {product.tinhtrang}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
