import { useState } from "react";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Nguyễn Văn A", role: "Quản lý", email: "a@gmail.com" },
    { id: 2, name: "Trần Thị B", role: "Nhân viên bán hàng", email: "b@gmail.com" },
    { id: 3, name: "Lê Văn C", role: "Kế toán", email: "c@gmail.com" }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    email: ""
  });

  const [editingEmployee, setEditingEmployee] = useState(null); // State cho sửa nhân viên

  // Thêm nhân viên mới
  const handleAddEmployee = () => {
    const newEmployeeData = { ...newEmployee, id: Date.now() }; // Thêm id tự động
    setEmployees([...employees, newEmployeeData]);
    setNewEmployee({ name: "", role: "", email: "" }); // Reset form
  };

  // Mở form sửa nhân viên
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  // Lưu thay đổi khi sửa nhân viên
  const handleSaveEdit = () => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === editingEmployee.id ? editingEmployee : emp
    );
    setEmployees(updatedEmployees);
    setEditingEmployee(null); // Đóng form sửa
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>

      {/* Form thêm nhân viên */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Tên nhân viên"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Chức vụ"
          value={newEmployee.role}
          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
        />
        <input
          type="email"
          className="border p-2 mr-2"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
        />
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 text-white p-2"
        >
          Thêm nhân viên
        </button>
      </div>

      {/* Form sửa nhân viên */}
      {editingEmployee && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Chỉnh sửa thông tin nhân viên</h2>
          <input
            type="text"
            className="border p-2 mr-2"
            value={editingEmployee.name}
            onChange={(e) =>
              setEditingEmployee({ ...editingEmployee, name: e.target.value })
            }
          />
          <input
            type="text"
            className="border p-2 mr-2"
            value={editingEmployee.role}
            onChange={(e) =>
              setEditingEmployee({ ...editingEmployee, role: e.target.value })
            }
          />
          <input
            type="email"
            className="border p-2 mr-2"
            value={editingEmployee.email}
            onChange={(e) =>
              setEditingEmployee({ ...editingEmployee, email: e.target.value })
            }
          />
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white p-2"
          >
            Lưu thay đổi
          </button>
        </div>
      )}

      {/* Bảng danh sách nhân viên */}
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
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.role}</td>
              <td className="p-2 border">{emp.email}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(emp)} // Mở form sửa khi bấm "Sửa"
                  className="bg-yellow-500 text-white p-1"
                >
                  Sửa
                </button>
                <button
                  onClick={() => setEmployees(employees.filter(e => e.id !== emp.id))}
                  className="bg-red-500 text-white p-1 ml-2"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManager;
