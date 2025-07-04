import { useState, useEffect } from "react";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const convertRole = (code) => {
    switch (code) {
      case 1: return "Quản lý";
      case 2: return "Khách hàng";
      case 3: return "Nhân viên bán hàng";
      default: return "Không xác định";
    }
  };

  const fetchEmployees = async (pageNumber = 1, search = "", role = "") => {
    setLoading(true);

    const query = new URLSearchParams({
      page: pageNumber,
      limit,
    });
    if (search) query.append("search", search);
    if (role) query.append("role", role);

    try {
      const res = await fetch(`http://localhost:4004/api/admin/users?${query.toString()}`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        const mapped = json.users.map((emp) => ({
          id: emp.mataikhoan,
          name: emp.tendangnhap,
          email: emp.email,
          role: emp.marole,
        }));
        setEmployees(mapped);
        setPage(json.pagination.page);
        setTotalPages(json.pagination.totalPages);
      } else {
        if (json.error === "Không có quyền truy cập") {
          alert("⚠️ Bạn không phải admin");
        } else {
          alert("❌ Không thể tải danh sách.");
        }
      }
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
      alert("❌ Lỗi khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const handleEdit = (employee) => setEditingEmployee(employee);

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:4004/api/admin/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          marole: editingEmployee.role,
          tendangnhap: editingEmployee.name,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Cập nhật thành công!");
        fetchEmployees(page, searchEmail, selectedRole);
        setEditingEmployee(null);
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      const response = await fetch(`http://localhost:4004/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        alert("Xóa thành công!");
        fetchEmployees(page, searchEmail, selectedRole);
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Có lỗi xảy ra khi xóa.");
    }
  };

  const handleSearch = () => {
    fetchEmployees(1, searchEmail.trim(), selectedRole);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quản lý tài khoản</h1>

      {/* 🔍 Form tìm kiếm */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="email"
          className="border p-2"
          placeholder="Nhập email để tìm kiếm"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <select
          className="border p-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Lọc theo chức vụ --</option>
          <option value="1">Quản lý</option>
          <option value="2">Khách hàng</option>
          <option value="3">Nhân viên bán hàng</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => {
            setSearchEmail('');
            setSelectedRole('');
            fetchEmployees(1);
          }}
          className="bg-gray-400 text-white px-4 py-2"
        >
          Xoá bộ lọc
        </button>
      </div>

      {/* Form chỉnh sửa */}
      {editingEmployee && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Chỉnh sửa nhân viên</h2>
          <input
            type="text"
            className="border p-2 mr-2 opacity-70"
            value={editingEmployee.name}
            disabled
          />
          <select
            className="border p-2 mr-2"
            value={editingEmployee.role}
            onChange={(e) =>
              setEditingEmployee({ ...editingEmployee, role: parseInt(e.target.value) })
            }
          >
            <option value={1}>Quản lý</option>
            <option value={2}>Khách hàng</option>
            <option value={3}>Nhân viên bán hàng</option>
          </select>
          <input
            type="email"
            className="border p-2 mr-2 opacity-70"
            value={editingEmployee.email}
            disabled
          />
          <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2">
            Lưu thay đổi
          </button>
        </div>
      )}

      {/* Danh sách */}
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Chức vụ</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{(page - 1) * limit + index + 1}</td>
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{convertRole(emp.role)}</td>
                  <td className="p-2 border">{emp.email}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-yellow-500 text-white p-1"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 text-white p-1 ml-2"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => fetchEmployees(page - 1, searchEmail, selectedRole)}
              disabled={page <= 1}
              className="px-3 py-1 border bg-gray-100 rounded disabled:opacity-50"
            >
              ← Trước
            </button>
            <span>Trang <strong>{page}</strong> / {totalPages}</span>
            <button
              onClick={() => fetchEmployees(page + 1, searchEmail, selectedRole)}
              disabled={page >= totalPages}
              className="px-3 py-1 border bg-gray-100 rounded disabled:opacity-50"
            >
              Tiếp →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeManager;
