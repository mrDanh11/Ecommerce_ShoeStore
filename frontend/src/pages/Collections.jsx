import { useEffect, useState, useMemo } from "react";
import ProductItem from "../components/ProductItem";

const Collections = () => {
  // ----------- Dữ liệu mẫu (Mock Data) trực tiếp trong component ------------
  const [products, setProducts] = useState([]); 
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Dữ liệu sản phẩm giày dép mẫu
  const defaultProducts = [
    {
      id: 1,
      name: "Giày Thể Thao Low Top Đen",
      image: "https://placehold.co/300x400/000000/FFFFFF?text=Low+Top+Black", 
      price: 1200000,
      category: "Nam",
      style: "Low Top",
      description: "Giày thể thao năng động, phong cách Low Top."
    },
    {
      id: 2,
      name: "Giày Casual Mid Top Trắng",
      image: "https://placehold.co/300x400/FFFFFF/000000?text=Mid+Top+White", 
      price: 950000,
      category: "Nữ",
      style: "Mid Top",
      description: "Giày Mid Top thời trang, dễ phối đồ."
    },
    {
      id: 3,
      name: "Giày Boot High Top Nâu",
      image: "https://placehold.co/300x400/8B4513/FFFFFF?text=High+Top+Brown", 
      price: 1800000,
      category: "Nam",
      style: "High Top",
      description: "Giày Boot High Top cá tính, phù hợp mùa đông."
    },
    {
      id: 4,
      name: "Giày Sneaker Low Top Xám",
      image: "https://placehold.co/300x400/808080/FFFFFF?text=Low+Top+Grey", 
      price: 1100000,
      category: "Nam",
      style: "Low Top",
      description: "Sneaker Low Top nhẹ nhàng, thoải mái."
    },
    {
      id: 5,
      name: "Giày Bệt Nữ Hồng",
      image: "https://placehold.co/300x400/FFC0CB/000000?text=Flat+Pink", 
      price: 600000,
      category: "Nữ",
      style: "Low Top", 
      description: "Giày bệt nữ màu hồng pastel."
    },
    {
      id: 6,
      name: "Giày Chạy Bộ Low Top Xanh",
      image: "https://placehold.co/300x400/0000FF/FFFFFF?text=Running+Blue", 
      price: 1500000,
      category: "Trẻ Em", 
      style: "Low Top",
      description: "Giày chạy bộ chuyên dụng, nhẹ và êm."
    },
    {
      id: 7,
      name: "Giày Sandal Trẻ Em Đỏ",
      image: "https://placehold.co/300x400/FF0000/FFFFFF?text=Sandal+Red", 
      price: 350000,
      category: "Trẻ Em",
      style: "Low Top", 
      description: "Sandal cho bé thoải mái vận động."
    },
    {
      id: 8,
      name: "Giày Cao Gót Nữ Đen",
      image: "https://placehold.co/300x400/333333/FFFFFF?text=Heels+Black", 
      price: 750000,
      category: "Nữ",
      style: "High Top", 
      description: "Giày cao gót thanh lịch, phù hợp dự tiệc."
    },
    {
      id: 9,
      name: "Giày Lười Nam Nâu",
      image: "https://placehold.co/300x400/A0522D/FFFFFF?text=Loafer+Brown", 
      price: 850000,
      category: "Nam",
      style: "Low Top",
      description: "Giày lười nam da lộn, phong cách casual."
    },
    {
      id: 10,
      name: "Giày Sneaker Trẻ Em Trắng",
      image: "https://placehold.co/300x400/F0F0F0/000000?text=Sneaker+Kids+White", 
      price: 500000,
      category: "Trẻ Em",
      style: "Low Top",
      description: "Sneaker cho trẻ em năng động."
    },
    {
      id: 11,
      name: "Giày Boots Nữ Cổ Cao",
      image: "https://placehold.co/300x400/6A5ACD/FFFFFF?text=Boots+Violet", 
      price: 2000000,
      category: "Nữ",
      style: "High Top",
      description: "Giày boots cổ cao thời trang."
    },
    {
      id: 12,
      name: "Giày Bóng Rổ Mid Top",
      image: "https://placehold.co/300x400/FFA500/FFFFFF?text=Basketball+Orange", 
      price: 1600000,
      category: "Nam",
      style: "Mid Top",
      description: "Giày bóng rổ chuyên nghiệp, hỗ trợ cổ chân."
    },
  ];

  useEffect(() => {
    setProducts(defaultProducts);
  }, []);

  // --------------------------------------------------------------------------

  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState([]); 
  const [style, setStyle] = useState([]); 
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleStyle = (e) => {
    const value = e.target.value;
    setStyle((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

   // Sử dụng useMemo để tính toán filtered và sorted products
    const filteredAndSortedProducts = useMemo(() => {
      let productsToDisplay = [...products];

      // Lọc theo tìm kiếm
      if (showSearch && search) {
        productsToDisplay = productsToDisplay.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Lọc theo danh mục
      if (category.length > 0) {
        productsToDisplay = productsToDisplay.filter((item) =>
          category.includes(item.category)
        );
      }

      // Lọc theo kiểu dáng
      if (style.length > 0) {
        productsToDisplay = productsToDisplay.filter((item) =>
          style.includes(item.style)
        );
      }

      // Sắp xếp
      switch (sortType) {
        case "low-high":
          productsToDisplay.sort((a, b) => a.price - b.price);
          break;
        case "high-low":
          productsToDisplay.sort((a, b) => b.price - a.price);
          break;
        case "relavent":
        default:
          break;
      }

      return productsToDisplay;
  }, [products, category, style, search, showSearch, sortType]);

  return (
    <main className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t max-w-7xl mx-auto min-h-screen overflow-hidden px-4 sm:px-6 lg:px-8'> 
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2 font-medium'>
          BỘ LỌC{" "}
        </p>
        {/* Danh mục (Category) filter */}
        <div className={`border border-gray-300 pl-5 pr-3 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-medium'>GIỚI TÍNH</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1' 
                type='checkbox'
                value={"Nam"}
                onChange={toggleCategory}
                checked={category.includes("Nam")} 
              />{" "}
              Nam
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1'
                type='checkbox'
                value={"Nữ"}
                onChange={toggleCategory}
                checked={category.includes("Nữ")} 
              />{" "}
              Nữ
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1'
                type='checkbox'
                value={"Trẻ Em"}
                onChange={toggleCategory}
                checked={category.includes("Trẻ Em")} 
              />{" "}
              Trẻ Em
            </label>
          </div>
        </div>

        {/* Kiểu dáng (Style) filter */}
        <div className={`border border-gray-300 pl-5 pr-3 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"}`}>
          <p className='mb-3 text-sm font-medium'>KIỂU DÁNG</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1'
                type='checkbox'
                value={"Low Top"}
                onChange={toggleStyle}
                checked={style.includes("Low Top")} 
              />{" "}
              Low Top
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1'
                type='checkbox'
                value={"Mid Top"}
                onChange={toggleStyle}
                checked={style.includes("Mid Top")} 
              />{" "}
              Mid Top
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input
                className='w-3 h-3 mt-1'
                type='checkbox'
                value={"High Top"}
                onChange={toggleStyle}
                checked={style.includes("High Top")} 
              />{" "}
              High Top
            </label>
          </div>
        </div>
      </div>

      {/* Filter Products */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <h1 className="text-black text-2xl font-bold">TẤT CẢ SẢN PHẨM</h1> 

          {/* Product Sort */}
          <select 
            onChange={(e) => setSortType(e.target.value)}
            className='border border-gray-300 text-sm p-2'
            value={sortType} 
          > 
            <option value='relavent'>Sắp xếp theo: Liên quan</option>
            <option value='low-high'>Sắp xếp theo: Giá thấp đến cao</option>
            <option value='high-low'>Sắp xếp theo: Giá cao đến thấp</option>
          </select>
        </div>

        {/* Map products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((item) => (
              <ProductItem key={item.id} {...item} /> 
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg py-10">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Collections;
