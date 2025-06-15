import { useEffect, useState } from "react";

const ProductStatistics = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Gọi API lấy hóa đơn
  const fetchInvoices = async (from = "", to = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const res = await fetch(`http://localhost:4004/api/admin/invoices?${params.toString()}`, {
        credentials: "include",
      });

      const json = await res.json();
      if (json.success) {
        setInvoices(json.invoices);
        setTotalRevenue(json.totalRevenue);
      } else {
        console.error("Lỗi backend:", json.error);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi mặc định khi mở trang
  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleFilter = () => {
    fetchInvoices(fromDate, toDate);
  };

  const countByPromotion = invoices.reduce((acc, hd) => {
    const key = hd.khuyenmai?.tenkhuyenmai || "Không dùng";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">📊 Thống kê hóa đơn</h1>

      {/* Bộ lọc theo ngày */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="block font-semibold">Từ ngày:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Đến ngày:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
        >
          🔍 Lọc
        </button>
      </div>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Thống kê tổng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-100 p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-2">Tổng số hóa đơn</h2>
              <p className="text-2xl">{invoices.length}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-2">Tổng doanh thu</h2>
              <p className="text-2xl">{totalRevenue.toLocaleString()} VND</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-2">Theo khuyến mãi</h2>
              <ul>
                {Object.entries(countByPromotion).map(([name, count]) => (
                  <li key={name} className="text-base">
                    {name}: {count} đơn
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bảng chi tiết hóa đơn */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Mã hóa đơn</th>
                  <th className="p-2 border">Tổng tiền</th>
                  <th className="p-2 border">Thành tiền</th>
                  <th className="p-2 border">Ngày đặt</th>
                  <th className="p-2 border">Tên khuyến mãi</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((hd, idx) => (
                  <tr key={hd.mahoadon} className="hover:bg-gray-50">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">{hd.mahoadon}</td>
                    <td className="p-2 border">{hd.tongtien?.toLocaleString()} VND</td>
                    <td className="p-2 border">{hd.thanhtien?.toLocaleString()} VND</td>
                    <td className="p-2 border">{hd.ngaydat?.slice(0, 10)}</td>
                    <td className="p-2 border">
                      {hd.khuyenmai?.tenkhuyenmai || "Không dùng"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductStatistics;
