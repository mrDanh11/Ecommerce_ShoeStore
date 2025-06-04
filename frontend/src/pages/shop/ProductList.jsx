import ProductCard from "../../components/ProductCard";

// Import ảnh từ thư mục assets/products/
import img1 from "../../assets/products/shoe1.jpg";
import img2 from "../../assets/products/shoe2.jpg";
import img3 from "../../assets/products/shoe3.jpg";
import img4 from "../../assets/products/shoe4.jpg";

// Log kiểm tra đường dẫn ảnh có đúng không
console.log("IMAGE TEST:", img1, img2, img3, img4);

const products = [
  {
    name: "Giày Nâu Đế Cao",
    price: "1,000,000 VNĐ",
    description: "Thiết kế basic, dễ phối đồ",
    image: img1
  },
  {
    name: "Giày Sneaker Xanh",
    price: "1,250,000 VNĐ",
    description: "Đế êm, thích hợp đi học và đi chơi",
    image: img2
  },
  {
    name: "Giày nâu Cổ Thấp",
    price: "1,450,000 VNĐ",
    description: "Dành cho phong cách trẻ trung",
    image: img3
  },
  {
    name: "Giày Trắng cổ thấp",
    price: "1,350,000 VNĐ",
    description: "Cá tính, nổi bật",
    image: img4
  }
];

const ProductList = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item, index) => (
          <ProductCard key={index} product={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
