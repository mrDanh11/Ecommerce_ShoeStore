import { useState, useEffect } from "react";
import dayjs from "dayjs";

const PromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editPromotion, setEditPromotion] = useState(null);
  const [form, setForm] = useState({
    tenkhuyenmai: "",
    giatri: "",
    trangthai: true,
    ngaybatdau: "",
    ngayketthuc: "",
  });

  // Fetch danh sách khuyến mãi (có thể có từ khóa tìm kiếm)
  const fetchPromotions = async (search = "") => {
    setLoading(true);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await fetch(`http://localhost:4004/api/admin/promotions${query}`);
      const json = await res.json();

      if (json.success) {
        setPromotions(json.data || []);
      } else {
        alert("Không thể tải danh sách khuyến mãi");
        setPromotions([]);
      }
    } catch (err) {
      console.error("Lỗi khi fetch khuyến mãi:", err);
      alert("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleSubmit = async () => {
    const method = editPromotion ? "PUT" : "POST";
    const url = editPromotion
      ? `http://localhost:4004/api/admin/promotions/${editPromotion.makhuyenmai}`
      : "http://localhost:4004/api/admin/promotions";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.success) {
        alert(editPromotion ? "Cập nhật thành công" : "Thêm thành công");
        fetchPromotions(searchTerm);
        setForm({
          tenkhuyenmai: "",
          giatri: "",
          trangthai: true,
          ngaybatdau: "",
          ngayketthuc: "",
        });
        setEditPromotion(null);
      } else {
        alert("Thất bại: " + json.error);
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("Lỗi kết nối");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá khuyến mãi này?")) return;

    try {
      const res = await fetch(`http://localhost:4004/api/admin/promotions/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        alert("Đã xoá thành công");
        fetchPromotions(searchTerm);
      } else {
        alert("Xoá thất bại: " + json.error);
      }
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      alert("Xoá thất bại");
    }
  };

  const handleEdit = (promo) => {
    setEditPromotion(promo);
    setForm({
      tenkhuyenmai: promo.tenkhuyenmai,
      giatri: promo.giatri,
      trangthai: promo.trangthai,
      ngaybatdau: promo.ngaybatdau,
      ngayketthuc: promo.ngayketthuc,
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quản lý khuyến mãi</h1>

      {/* Tìm kiếm */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2 w-72"
          placeholder="Nhập tên khuyến mãi để tìm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => fetchPromotions(searchTerm.trim())}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            fetchPromotions("");
          }}
          className="bg-gray-400 text-white px-4 py-2"
        >
          Xoá bộ lọc
        </button>
      </div>

      {/* Form thêm/sửa */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Tên khuyến mãi"
          className="border p-2 w-full"
          value={form.tenkhuyenmai}
          onChange={(e) => setForm({ ...form, tenkhuyenmai: e.target.value })}
        />
        <input
          type="number"
          placeholder="Giá trị"
          className="border p-2 w-full"
          value={form.giatri}
          onChange={(e) => setForm({ ...form, giatri: parseFloat(e.target.value) })}
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={form.ngaybatdau}
          onChange={(e) => setForm({ ...form, ngaybatdau: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={form.ngayketthuc}
          onChange={(e) => setForm({ ...form, ngayketthuc: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editPromotion ? "Cập nhật" : "Thêm"} khuyến mãi
        </button>
      </div>

      {/* Bảng danh sách khuyến mãi */}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Tên</th>
              <th className="p-2 border">Giá trị</th>
              <th className="p-2 border">Trạng thái</th>
              <th className="p-2 border">Bắt đầu</th>
              <th className="p-2 border">Kết thúc</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <tr key={promo.makhuyenmai} className="hover:bg-gray-50">
                  <td className="p-2 border">{promo.tenkhuyenmai}</td>
                  <td className="p-2 border">{parseFloat(promo.giatri).toLocaleString()} VND</td>
                  <td className="p-2 border">
                    {promo.trangthai ? "Còn hiệu lực" : "Hết hạn"}
                  </td>
                  <td className="p-2 border">{dayjs(promo.ngaybatdau).format("DD/MM/YYYY")}</td>
                  <td className="p-2 border">{dayjs(promo.ngayketthuc).format("DD/MM/YYYY")}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(promo.makhuyenmai)}
                      className="text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Không có khuyến mãi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PromotionManager
