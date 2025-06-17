import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductItem from "../components/ProductItem";

const Collections = () => {
  // States
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState([]);
  const [style, setStyle] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4004/api/products/");
        if (res.data.errorCode === 0) {
          const mapped = res.data.data.map((p) => ({
            id: p.masanpham,
            name: p.tensanpham,
            image: p.anhsanpham,
            price: p.gia,
            category: p.danhmucsanpham.tendanhmuc,
            style: p.chitietsanpham.map((d) => d.size),
            description: p.description,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Unique filter options
  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );
  const uniqueStyles = useMemo(
    () => [...new Set(products.flatMap((p) => p.style))],
    [products]
  );

  // Toggle filters
  const toggleCategory = (e) => {
    const val = e.target.value;
    setCategory((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };
  const toggleStyle = (e) => {
    const val = e.target.value;
    setStyle((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  // Filter & sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];
    // Search
    if (showSearch && search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    // Category filter
    if (category.length) {
      list = list.filter((p) => category.includes(p.category));
    }
    // Style (size) filter
    if (style.length) {
      list = list.filter((p) => p.style.some((sz) => style.includes(sz)));
    }
    // Sort
    switch (sortType) {
      case "low-high":
        list.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return list;
  }, [products, search, showSearch, category, style, sortType]);

  return (
    <main className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilters(!showFilters)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 font-medium"
        >
          BỘ LỌC
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 pr-3 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"
            }`}
        >
          <p className="mb-3 text-sm font-medium">DANH MỤC</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {uniqueCategories.map((cat) => (
              <label key={cat} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3 h-3 mt-1"
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Style Filter (Sizes) */}
        <div
          className={`border border-gray-300 pl-5 pr-3 py-3 mt-6 sm:block ${showFilters ? "" : "hidden"
            }`}
        >
          <p className="mb-3 text-sm font-medium">SIZE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {uniqueStyles.map((sz) => (
              <label key={sz} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3 h-3 mt-1"
                  type="checkbox"
                  value={sz}
                  onChange={toggleStyle}
                  checked={style.includes(sz)}
                />
                {sz}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <h1 className="text-black text-2xl font-bold">TẤT CẢ SẢN PHẨM</h1>
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm p-2"
            value={sortType}
          >
            <option value="relavent">Sắp xếp theo: Liên quan</option>
            <option value="low-high">Sắp xếp theo: Giá thấp đến cao</option>
            <option value="high-low">Sắp xếp theo: Giá cao đến thấp</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((item) => {
              console.log('check item: ', item)
              return <ProductItem key={item.id} {...item} />
            }
            )
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
