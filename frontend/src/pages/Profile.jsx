import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:4004/api/auth/getme', {
          withCredentials: true,
        });
        setUser(res.data.user);
        setFormData(res.data.user);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || "Không thể xác thực người dùng");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4004/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (err) {
      alert("Đăng xuất thất bại.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put('http://localhost:4004/api/auth/update', formData, {
        withCredentials: true,
      });
      setUser(res.data);
      setEditMode(false);
      alert("✅ Cập nhật thành công");
    } catch (err) {
      alert("❌ Cập nhật thất bại");
    }
  };

  const changePassword = async () => {
    try {
      const res = await axios.post('http://localhost:4004/api/auth/changepassword', {
        currentmatkhau: passwords.current,
        newmatkhau: passwords.new
      }, { withCredentials: true });

      alert(res.data.message || "Đổi mật khẩu thành công");
      setChangePass(false);
      setPasswords({ current: '', new: '' });
    } catch (err) {
      alert(err?.response?.data?.message || "❌ Đổi mật khẩu thất bại");
    }
  };

  const getRoleName = (vaitro) => {
    switch (vaitro) {
      case 1: return "Quản lý (Admin)";
      case 2: return "Khách hàng";
      case 3: return "Nhân viên bán hàng";
      default: return "Không xác định";
    }
  };

  if (loading) return <Loading />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4 text-center">
        <h3 className="text-xl font-semibold text-red-500">⚠️ Bạn chưa đăng nhập</h3>
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={() => navigate('/login')}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          🔐 Chuyển đến trang đăng nhập
        </button>
      </div>
    );
  }

  const role = user.vaitro ?? user.marole;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700">👤 Hồ sơ người dùng</h2>

        {/* Thông tin cá nhân */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Thông tin cá nhân</h3>
          {editMode ? (
            <>
              <input name="tendangnhap" value={formData.tendangnhap || ''} onChange={handleChange} placeholder="Họ tên" className="w-full border px-3 py-2 rounded" />
              <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full border px-3 py-2 rounded" />
              <input name="sdt" value={formData.sdt || ''} onChange={handleChange} placeholder="Số điện thoại" className="w-full border px-3 py-2 rounded" />
              <input name="diachi" value={formData.diachi || ''} onChange={handleChange} placeholder="Địa chỉ" className="w-full border px-3 py-2 rounded" />
              <div className="flex gap-2 pt-2">
                <button onClick={saveChanges} className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 w-full">💾 Lưu</button>
                <button onClick={() => setEditMode(false)} className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-600 w-full">❌ Hủy</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Họ tên:</strong> {user.tendangnhap}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>SĐT:</strong> {user.sdt || "Chưa có"}</p>
              <p><strong>Địa chỉ:</strong> {user.diachi || "Chưa có"}</p>
              <p><strong>Vai trò:</strong> {getRoleName(role)}</p>
              <button
                onClick={() => setEditMode(true)}
                className="items-center cursor-pointer gap-2 bg-blue-100 text-blue-800 px-4 py-2 w-full rounded-md hover:bg-blue-200 transition mt-2"
              >
                ✏️ Chỉnh sửa thông tin
              </button>
            </>
          )}
        </div>

        {/* Đổi mật khẩu */}
        <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">🔐 Mật khẩu</h3>
          {changePass ? (
            <>
              {user.matkhau ? (
                <input
                  name="current"
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full border px-3 py-2 rounded"
                />
              ) : (
                <p className="text-sm text-gray-600 italic">
                  ⚠️ Bạn chưa có mật khẩu (đăng nhập bằng Google). Vui lòng đặt mật khẩu mới.
                </p>
              )}

              <input
                name="new"
                type="password"
                placeholder="Mật khẩu mới"
                value={passwords.new}
                onChange={handlePasswordChange}
                className="w-full border px-3 py-2 rounded"
              />

              <div className="flex gap-2">
                <button
                  onClick={changePassword}
                  className="bg-yellow-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-yellow-700 w-full"
                >
                  {user.matkhau ? '🔁 Đổi mật khẩu' : '➕ Đặt mật khẩu'}
                </button>
                <button
                  onClick={() => setChangePass(false)}
                  className="bg-gray-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-gray-600 w-full"
                >
                  ❌ Hủy
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setChangePass(true)}
              className=" items-center cursor-pointer gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 w-full rounded hover:bg-yellow-200 transition"
            >
              {user.matkhau ? '🔁 Đổi mật khẩu' : '➕ Đặt mật khẩu'}
            </button>
          )}
        </div>

        {/* Các hành động khác */}
        <div className="pt-4 space-y-3">
          {role === 1 && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md w-full hover:bg-indigo-700"
            >
              🛠️ Đi đến trang quản trị
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-600 cursor-pointer text-white px-6 py-3 rounded-md w-full hover:bg-red-700"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
