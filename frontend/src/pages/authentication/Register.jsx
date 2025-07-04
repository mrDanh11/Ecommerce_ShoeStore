import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    sdt: '',
    diachi: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu không giống nhau!');
      return;
    }

    try {
      const response = await fetch('http://localhost:4004/api/auth/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tendangnhap: form.fullName,
          email: form.email,
          matkhau: form.password,
          sdt: form.sdt,
          diachi: form.diachi
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");

    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      alert(error.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1 text-center">ĐĂNG KÝ</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Nhập thông tin cá nhân để tạo tài khoản</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
            <input
              type="text"
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              required
              className="bg-white mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="bg-white mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.sdt}
              onChange={e => setForm({ ...form, sdt: e.target.value })}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ *</label>
            <input
              type="text"
              placeholder="Địa chỉ"
              value={form.diachi}
              onChange={e => setForm({ ...form, diachi: e.target.value })}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu *</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="bg-white mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="bg-white mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
          >
            ĐĂNG KÝ
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Bạn đã có tài khoản?{' '}
          <Link to="/login" className="text-black font-medium hover:underline">
            Đăng nhập tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
