import React, { useState, useEffect, useMemo } from "react";
import toVND from "../utils/helper.js";
import Loading from "../components/Loading";

const pageSize = 10;                          
// const customerId = "5525453c-8f4e-4287-b380-ff1533826b56";
const customerId = localStorage.getItem("customerId") 

export default function OrderPage() {
  const [rawData,   setRawData]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [page,      setPage]      = useState(0);  
  const [totalRows, setTotalRows] = useState(0);  

  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate,      setFromDate]    = useState("");
  const [toDate,        setToDate]      = useState("");

  const formatVND = (v) => (v != null ? toVND(v) : "0₫");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const body = {
          limit:  pageSize,
          offset: page * pageSize,
          filters: { makhachhang: customerId }
        };
        if (statusFilter) body.filters.trangthai = statusFilter;
        if (fromDate)     body.filters.fromDate = fromDate;
        if (toDate)       body.filters.toDate   = toDate;

        const res  = await fetch("http://localhost:4004/v1/api/order/userorder/",{
          method : "POST",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify(body)
        });
        const json = await res.json();
        if (!json.success) throw new Error("Không thể lấy dữ liệu");

        setRawData(json.data);
        setTotalRows(json.totalCount ?? ((page * pageSize) + json.data.length));
        setError(null);
      } catch (e) {
        setError(e.message || "Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, statusFilter, fromDate, toDate]);

  const orders = useMemo(() => {
    const map = {};
    for (const row of rawData) {
      const id = row.mahoadon;
      if (!map[id]) map[id] = { mahoadon: id, hoadon: row.hoadon, items: [] };
      map[id].items.push(row.chitietsanpham);
    }
    return Object.values(map);
  }, [rawData]);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  if (loading) return <Loading />;
  if (error)   return <div className="py-20 text-center text-red-600">{error}</div>;

  return (
    <div className="px-4 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-4">Đơn hàng của bạn</h2>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select className="border px-2 py-1"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="Chưa/Đang Giao">Chưa/Đang Giao</option>
          <option value="Đang Giao">Đang Giao</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>

        <input type="date" className="border px-2 py-1"
          value={fromDate}
          onChange={e => { setFromDate(e.target.value); setPage(0); }} />

        <input type="date" className="border px-2 py-1"
          value={toDate}
          onChange={e => { setToDate(e.target.value); setPage(0); }} />
      </div>

      <div className="space-y-6">
        {orders.map(order => {
          const paid = Array.isArray(order.hoadon.payment)
            ? order.hoadon.payment
              .filter(p => p.status === "completed")
              .reduce((s,p)=>s+p.amount,0)
            : 0;

          return (
            <div key={order.mahoadon} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Mã hóa đơn: {order.mahoadon}</span>
                <span>{order.hoadon.ngaydat}</span>
              </div>
              <div className="mt-2">Trạng thái: {order.hoadon.shipment.trangthai}</div>

              <div className="mt-4 space-y-2">
                {order.items.map((item,i)=>(
                  <div key={i} className="flex items-center space-x-4">
                    <img src={item.sanpham.anhsanpham}
                      alt={item.sanpham.tensanpham}
                      className="w-12 h-12 object-cover rounded" />
                    <div className="flex-grow">
                      <div>{item.sanpham.tensanpham}</div>
                      <div className="text-sm text-gray-500">
                        Size: {item.size}, Màu: {item.color}
                      </div>
                    </div>
                    <div>{formatVND(item.gia * item.soluong)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between font-semibold">
                <span>Tổng đơn: {formatVND(order.hoadon.tongtien)}</span>
                <span>Đã thanh toán: {formatVND(paid)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-1 flex-wrap">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className={`px-3 py-1 rounded ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200"}`}>
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`px-3 py-1 rounded ${idx === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200"}`}>
              {idx + 1}
            </button>
          ))}

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className={`px-3 py-1 rounded ${page >= totalPages - 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200"}`}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}



